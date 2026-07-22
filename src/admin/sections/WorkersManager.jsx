import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function WorkersManager({ products = [], setProducts }) {
  const [activeTab, setActiveTab] = useState("directory"); // directory, logging, reports
  const [workers, setWorkers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const firstDay = `${currentYear}-${currentMonth}-01`;
  const lastDay = `${currentYear}-${currentMonth}-${String(lastDayOfMonth).padStart(2, '0')}`;
  const todayStr = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, '0')}`;
  const currentMonthStr = `${currentYear}-${currentMonth}`;
  const [globalDateFilter, setGlobalDateFilter] = useState({ start: firstDay, end: lastDay });

  // Forms State
  const [workerForm, setWorkerForm] = useState({ name: "", phone: "", role: "Packer" });
  const [logMeta, setLogMeta] = useState({ worker_id: "", production_date: new Date().toISOString().split('T')[0], daily_wage: "", is_per_day: false, payment_status: 'paid' });
  const [logEntries, setLogEntries] = useState([{ product_id: "", quantity: "", rate_per_packet: "" }]);

  useEffect(() => {
    fetchData();
  }, [globalDateFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [workersRes, logsRes] = await Promise.all([
        supabase.from("workers").select("*").order("created_at", { ascending: false }),
        supabase.from("production_logs")
          .select("*, workers(name), products(name)")
          .gte("production_date", globalDateFilter.start || '2000-01-01')
          .lte("production_date", globalDateFilter.end || '2100-01-01')
          .order("production_date", { ascending: false })
      ]);
      if (workersRes.error) throw workersRes.error;
      if (logsRes.error) throw logsRes.error;
      setWorkers(workersRes.data || []);
      setLogs(logsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!workerForm.name.trim()) return alert("Name is required");
    setProcessing(true);
    try {
      const { data, error } = await supabase.from("workers").insert([workerForm]).select();
      if (error) throw error;
      setWorkers([data[0], ...workers]);
      setWorkerForm({ name: "", phone: "", role: "Packer" });
      alert("Worker added successfully!");
    } catch (err) {
      alert("Error adding worker: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleWorkerStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setProcessing(true);
    try {
      const { error } = await supabase.from("workers").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setWorkers(workers.map(w => w.id === id ? { ...w, status: newStatus } : w));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogProduction = async (e) => {
    e.preventDefault();
    if (!logMeta.worker_id) return alert("Please select a worker");
    
    const isPerDay = logMeta.is_per_day;
    
    // Validate all entries
    for (const entry of logEntries) {
      if (!entry.product_id || !entry.quantity) {
        return alert("Please fill product and quantity for all entries");
      }
      if (!isPerDay && !entry.rate_per_packet) {
        return alert("Please fill the rate field for all products");
      }
    }
    
    if (isPerDay && !logMeta.daily_wage) {
      return alert("Please enter the Daily Wage amount");
    }
    
    setProcessing(true);
    try {
      const dailyWage = parseFloat(logMeta.daily_wage || 0);
      
      if (isPerDay && logEntries.length === 0) {
        // Logging daily wage directly without products
        const { error } = await supabase.from('production_logs').insert([{
           worker_id: logMeta.worker_id,
           product_id: null, // Null indicates this is a wage-only entry
           quantity: 1, // Must be > 0 to pass the production_logs_quantity_check constraint
           rate_per_packet: 0,
           total_income: dailyWage,
           production_date: logMeta.production_date,
           payment_status: logMeta.payment_status
        }]);
        if (error) throw error;
      } else {
        const promises = logEntries.map((entry, index) => {
          let finalRate = parseFloat(entry.rate_per_packet || 0);
          
          if (isPerDay) {
            if (index === 0) {
               const qty = parseInt(entry.quantity, 10);
               finalRate = qty > 0 ? (dailyWage / qty) : 0;
            } else {
               finalRate = 0;
            }
          }
          
          return supabase.rpc('log_production_and_update_stock', {
            p_worker_id: logMeta.worker_id,
            p_product_id: entry.product_id,
            p_quantity: parseInt(entry.quantity, 10),
            p_rate: finalRate,
            p_date: logMeta.production_date,
            p_payment_status: logMeta.payment_status
          });
        });
        
        const results = await Promise.all(promises);
        const errors = results.filter(r => r.error);
        
        if (errors.length > 0) {
          throw errors[0].error;
        }
        
        if (setProducts) {
          setProducts(prev => {
            let newProducts = [...prev];
            for (const entry of logEntries) {
              const qty = parseInt(entry.quantity, 10);
              newProducts = newProducts.map(p => 
                p.id === entry.product_id ? { ...p, stock: (p.stock || 0) + qty, updated_at: new Date().toISOString() } : p
              );
            }
            return newProducts;
          });
        }
      }
      
      alert(logEntries.length === 0 ? "Daily wage logged successfully!" : `Successfully logged ${logEntries.length} products and updated inventory!`);
      setLogMeta({ ...logMeta, worker_id: "", daily_wage: "", is_per_day: false, payment_status: 'paid' });
      setLogEntries([{ product_id: "", quantity: "", rate_per_packet: "" }]);
      fetchData(); // Refresh logs
    } catch (err) {
      alert("Error logging production: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async (logId) => {
    try {
      const { error } = await supabase.from('production_logs').update({ payment_status: 'paid' }).eq('id', logId);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Error marking as paid: " + err.message);
    }
  };

  const addLogEntry = () => setLogEntries([...logEntries, { product_id: "", quantity: "", rate_per_packet: "" }]);
  const removeLogEntry = (index) => setLogEntries(logEntries.filter((_, i) => i !== index));
  const updateLogEntry = (index, field, value) => {
    const newEntries = [...logEntries];
    newEntries[index][field] = value;
    setLogEntries(newEntries);
  };

  const getTabClass = (tabName) => {
    return activeTab === tabName 
      ? "px-6 py-3 border-b-2 border-primary text-primary font-bold bg-primary/5"
      : "px-6 py-3 border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-colors cursor-pointer";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="text-primary font-bold animate-pulse">Loading Workers Data...</div>
    </div>
  );

  const groupedLogs = logs.reduce((acc, log) => {
    const key = `${log.production_date}_${log.worker_id}`;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        date: log.production_date,
        worker_id: log.worker_id,
        worker_name: log.workers?.name || 'Unknown',
        total_income: 0,
        total_quantity: 0,
        products: []
      };
    }
    acc[key].products.push({
      id: log.id,
      name: log.products?.name || `Product ID: ${log.product_id}`,
      quantity: log.quantity,
      rate: log.rate_per_packet,
      income: log.total_income
    });
    acc[key].total_income += Number(log.total_income);
    acc[key].total_quantity += Number(log.quantity);
    return acc;
  }, {});
  
  const groupedLogsArray = Object.values(groupedLogs);
  
  const searchedLogsArray = groupedLogsArray.filter(group => {
    if (!logSearchQuery) return true;
    const q = logSearchQuery.toLowerCase();
    const dateStr = new Date(group.date).toLocaleDateString().toLowerCase();
    if (group.date.includes(q) || dateStr.includes(q)) return true;
    if (group.worker_name.toLowerCase().includes(q)) return true;
    return group.products.some(p => p.name.toLowerCase().includes(q));
  });

  const globalTotalPackets = logs.reduce((sum, log) => sum + Number(log.quantity), 0);
  const globalTotalLaborCost = logs.reduce((sum, log) => sum + Number(log.total_income), 0);
  const globalProductBreakdown = logs.reduce((acc, log) => {
    const name = log.product_id === null ? "Labor Cost" : (log.products?.name || `Product: ${log.product_id}`);
    if (!acc[name]) acc[name] = 0;
    acc[name] += Number(log.quantity);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-headline-md font-bold text-primary mb-2">Workers & Production</h2>
        <p className="text-on-surface-variant">Manage manufacturing workers, log daily piece-rate production, and automatically update inventory stock.</p>
      </div>

      <div className="flex border-b border-outline-variant mb-6 overflow-x-auto whitespace-nowrap">
        <button className={getTabClass("directory")} onClick={() => setActiveTab("directory")}>Worker Directory</button>
        <button className={getTabClass("logging")} onClick={() => setActiveTab("logging")}>Log Production</button>
        <button className={getTabClass("reports")} onClick={() => setActiveTab("reports")}>Production Logs</button>
      </div>

      {activeTab === "directory" && (
        selectedWorker ? (
          <WorkerProfile worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant h-fit">
            <h3 className="font-bold text-lg mb-4">Add New Worker</h3>
            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name *</label>
                <input required value={workerForm.name} onChange={e => setWorkerForm({...workerForm, name: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone Number</label>
                <input value={workerForm.phone} onChange={e => setWorkerForm({...workerForm, phone: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <select value={workerForm.role} onChange={e => setWorkerForm({...workerForm, role: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="Labor">Labor</option>
                  <option value="Packer">Packer</option>
                  <option value="Miller">Miller</option>
                  <option value="Loader">Loader</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
              <button disabled={processing} type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50">
                {processing ? "Adding..." : "Add Worker"}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="font-bold text-lg text-primary">Active Directory ({workers.length})</h3>
              
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  type="text" 
                  placeholder="Search workers..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-low"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1 w-full max-w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant text-sm text-on-surface-variant bg-surface-container-low">
                    <th className="py-3 px-4 rounded-tl-lg">Worker</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.filter(w => 
                    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (w.phone && w.phone.includes(searchQuery))
                  ).length === 0 ? (
                    <tr><td colSpan="5" className="py-8 text-center text-on-surface-variant">No workers found matching your search.</td></tr>
                  ) : (
                    workers.filter(w => 
                      w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (w.phone && w.phone.includes(searchQuery))
                    ).map(w => (
                      <tr key={w.id} className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=e8f5e9&color=1F5132&bold=true`} alt={w.name} className="w-10 h-10 rounded-full border border-outline-variant object-cover" />
                            <div>
                              <div className="font-bold text-primary">{w.name}</div>
                              <div className="text-xs text-on-surface-variant hidden md:block">Joined: {new Date(w.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-surface-container border border-outline-variant/50 text-on-surface font-medium py-1 px-3 rounded-full text-xs">
                            {w.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">call</span>
                            {w.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`py-1 px-3 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${w.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <button onClick={() => setSelectedWorker(w)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                               <span className="material-symbols-outlined text-[16px]">visibility</span>
                               Profile
                            </button>
                            <button disabled={processing} onClick={() => handleToggleWorkerStatus(w.id, w.status)} className={`flex items-center gap-1 text-xs font-bold transition-colors ${w.status === 'active' ? 'text-error hover:text-red-700' : 'text-primary hover:text-green-800'}`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {w.status === 'active' ? 'block' : 'check_circle'}
                              </span>
                              {w.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )
      )}

      {activeTab === "logging" && (
        <div className="max-w-3xl bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
          <h3 className="font-bold text-xl mb-2 text-primary">Log Daily Production</h3>
          <p className="text-sm text-on-surface-variant mb-6">Submitting this form will calculate the worker's pay and instantly add all packets to your inventory stock.</p>
          
          <form onSubmit={handleLogProduction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container p-4 rounded-lg">
              <div>
                <label className="block text-sm font-semibold mb-1">Date *</label>
                <input required type="date" max={todayStr} value={logMeta.production_date} onChange={e => setLogMeta({...logMeta, production_date: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Worker *</label>
                <select required value={logMeta.worker_id} onChange={e => {
                  const wId = e.target.value;
                  const selectedW = workers.find(w => w.id === wId);
                  setLogMeta({...logMeta, worker_id: wId, is_per_day: selectedW?.role === 'Labor'});
                }} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="">-- Select Worker --</option>
                  {workers.filter(w => w.status === 'active').map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer w-max bg-surface-container-low p-3 rounded-lg border border-outline-variant hover:border-primary/50 transition-colors">
                  <input type="checkbox" checked={logMeta.is_per_day} onChange={e => setLogMeta({...logMeta, is_per_day: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary" />
                  Tick to pay per-day fixed wage
                </label>

                <div className="flex gap-2 w-full p-1 bg-surface-container-low rounded-lg border border-outline-variant">
                  <button type="button" onClick={() => setLogMeta({...logMeta, payment_status: 'paid'})} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${logMeta.payment_status === 'paid' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Pay Now</button>
                  <button type="button" onClick={() => setLogMeta({...logMeta, payment_status: 'unpaid'})} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${logMeta.payment_status === 'unpaid' ? 'bg-error text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Pay Later (Unpaid)</button>
                </div>
              </div>
              {logMeta.is_per_day && (
                <div className="sm:col-span-2 bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <label className="block text-sm font-semibold text-primary mb-1">Total Daily Wage (₹) *</label>
                  <input required type="number" min="0" step="any" value={logMeta.daily_wage} onChange={e => setLogMeta({...logMeta, daily_wage: e.target.value})} placeholder="e.g. 500" className="w-full p-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-surface" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">Products Manufactured</h4>
                <button type="button" onClick={addLogEntry} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add Product
                </button>
              </div>

              {logEntries.map((entry, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border border-outline-variant rounded-lg relative">
                  {(logEntries.length > 1 || logMeta.is_per_day) && (
                    <button type="button" onClick={() => removeLogEntry(index)} className="absolute top-2 right-2 text-error hover:text-red-700" title="Remove Product">
                      <span className="material-symbols-outlined text-[20px]">cancel</span>
                    </button>
                  )}
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Product {index + 1} *</label>
                    <select required value={entry.product_id} onChange={e => updateLogEntry(index, 'product_id', e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.weight} (Stock: {p.stock})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={logMeta.is_per_day ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-semibold mb-1">Quantity *</label>
                      <input required type="number" min="0" step="any" value={entry.quantity} onChange={e => updateLogEntry(index, 'quantity', e.target.value)} placeholder="e.g. 500" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    {!logMeta.is_per_day && (
                      <div>
                        <label className="block text-sm font-semibold mb-1">Rate (₹) *</label>
                        <input required type="number" min="0" step="any" value={entry.rate_per_packet} onChange={e => updateLogEntry(index, 'rate_per_packet', e.target.value)} placeholder="e.g. 2.50" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {(!logMeta.is_per_day && logEntries.some(e => e.quantity && e.rate_per_packet)) && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-primary">Total Calculated Income:</span>
                <span className="text-xl font-bold text-primary">
                  ₹{logEntries.reduce((sum, e) => sum + ((parseFloat(e.quantity) || 0) * (parseFloat(e.rate_per_packet) || 0)), 0).toFixed(2)}
                </span>
              </div>
            )}

            {logMeta.is_per_day && logEntries.length === 0 && (
              <div className="bg-surface-container-low p-4 rounded-lg text-sm text-on-surface-variant flex gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                <p>No products selected. The Daily Wage will be logged directly to the worker's payout.</p>
              </div>
            )}

            <button disabled={processing} type="submit" className="w-full bg-primary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 whitespace-normal text-center leading-tight">
              <span className="material-symbols-outlined shrink-0">add_task</span>
              {processing ? "Saving..." : "Submit Production & Update Inventory"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* Global Analytics Dashboard */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="font-bold text-xl text-primary">Factory Production Overview</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-2 text-sm bg-surface-container p-2 rounded-lg border border-outline-variant/50 w-full sm:w-auto">
                  <span className="font-semibold text-on-surface-variant mr-1 whitespace-nowrap">Quick Month:</span>
                  <input 
                    type="month"
                    max={currentMonthStr}
                    value={globalDateFilter.start ? globalDateFilter.start.substring(0, 7) : ""}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const [yearStr, monthStr] = e.target.value.split('-');
                      const start = `${yearStr}-${monthStr}-01`;
                      const lastD = new Date(parseInt(yearStr), parseInt(monthStr), 0).getDate();
                      const end = `${yearStr}-${monthStr}-${String(lastD).padStart(2, '0')}`;
                      setGlobalDateFilter({ start, end });
                    }}
                    className="p-1 border rounded bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                <span className="text-on-surface-variant font-bold text-xs uppercase self-center sm:self-auto">OR</span>
                <div className="flex flex-wrap items-center gap-2 text-sm bg-surface-container p-2 rounded-lg border border-outline-variant/50 w-full sm:w-auto">
                  <span className="font-semibold text-on-surface-variant mr-1 whitespace-nowrap">Custom Range:</span>
                  <input type="date" max={todayStr} value={globalDateFilter.start} onChange={e => setGlobalDateFilter({...globalDateFilter, start: e.target.value})} className="p-1 border rounded bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <span className="text-on-surface-variant font-medium">to</span>
                  <input type="date" max={todayStr} value={globalDateFilter.end} onChange={e => setGlobalDateFilter({...globalDateFilter, end: e.target.value})} className="p-1 border rounded bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 p-5 rounded-lg border border-primary/20 flex flex-col justify-center">
                <div className="text-sm font-semibold text-primary/80 mb-1">Total Labor Cost</div>
                <div className="text-3xl font-black text-primary">₹{globalTotalLaborCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              
              <div className="bg-surface-container p-5 rounded-lg border border-outline-variant flex flex-col justify-center">
                <div className="text-sm font-semibold text-on-surface-variant mb-1">Total Packets Manufactured</div>
                <div className="text-3xl font-black">{globalTotalPackets.toLocaleString()}</div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant h-full flex flex-col">
                <div className="text-sm font-semibold text-on-surface-variant mb-2 pb-2 border-b border-outline-variant/50">Product Breakdown</div>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(globalProductBreakdown).length === 0 ? (
                    <div className="text-xs text-on-surface-variant italic">No production data in this period.</div>
                  ) : (
                    Object.entries(globalProductBreakdown).map(([name, qty]) => (
                      <div key={name} className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant truncate mr-2 font-medium" title={name}>{name}</span>
                        <span className="font-bold text-on-surface whitespace-nowrap">{qty.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-lg">Recent Production Logs</h3>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search date, worker, product..." 
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-low"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 w-full max-w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-on-surface-variant bg-surface-container-low">
                  <th className="py-3 px-4 rounded-tl-lg">Date</th>
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-4">Products Manufactured</th>
                  <th className="py-3 px-4 text-right">Total Packets</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Total Day Income</th>
                </tr>
              </thead>
              <tbody>
                {searchedLogsArray.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-on-surface-variant">No production logs found matching your criteria.</td></tr>
                ) : (
                  searchedLogsArray.map(group => (
                    <tr key={group.id} className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low/30">
                      <td className="py-3 px-4 text-sm text-on-surface-variant align-top">{new Date(group.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-primary align-top">{group.worker_name}</td>
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col min-w-[250px]">
                          {group.products.map(p => (
                            <div key={p.id} className="text-sm border-b last:border-0 border-outline-variant/30 py-2 flex justify-between items-center gap-4">
                              <div>
                                <div className="font-bold text-on-surface">{p.name}</div>
                                <div className="text-[11px] text-on-surface-variant">
                                  {p.quantity.toLocaleString()} pkts × ₹{Number(p.rate).toFixed(2)}/pkt
                                </div>
                              </div>
                              <div className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded text-xs">
                                ₹{Number(p.income).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-secondary align-top pt-5">{group.total_quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-primary align-top pt-5">₹{Number(group.total_income).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

function WorkerProfile({ worker, onClose }) {
  const [logs, setLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftSearchQuery, setShiftSearchQuery] = useState("");
  
  // Date filter defaults to current month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const lastDayOfMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const firstDay = `${currentYear}-${currentMonth}-01`;
  const lastDay = `${currentYear}-${currentMonth}-${String(lastDayOfMonth).padStart(2, '0')}`;
  const todayStr = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, '0')}`;
  const [dateFilter, setDateFilter] = useState({ start: firstDay, end: lastDay });

  useEffect(() => {
    fetchLogs();
  }, [worker]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logsRes, paymentsRes] = await Promise.all([
        supabase
          .from("production_logs")
          .select("*, products(name)")
          .eq("worker_id", worker.id)
          .order("production_date", { ascending: false }),
        supabase
          .from("worker_payments")
          .select("*")
          .eq("worker_id", worker.id)
      ]);
      
      if (logsRes.error) throw logsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      
      setLogs(logsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) {
      alert("Error fetching profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (monthKey, amount) => {
    if (!window.confirm(`Mark ${monthKey} as paid? (Amount: ₹${amount.toFixed(2)})`)) return;
    
    try {
      const { data, error } = await supabase
        .from("worker_payments")
        .insert([{ worker_id: worker.id, month_key: monthKey, amount_paid: amount }])
        .select();
        
      if (error) throw error;
      setPayments([...payments, data[0]]);
    } catch (err) {
      alert("Error marking as paid: " + err.message);
    }
  };

  const totalAllTimeEarned = logs.reduce((sum, log) => sum + Number(log.total_income), 0);
  const totalAllTimeUnpaid = logs.filter(l => l.payment_status === 'unpaid').reduce((sum, log) => sum + Number(log.total_income), 0);
  const totalAllTimeUnpaidItems = logs.filter(l => l.payment_status === 'unpaid').reduce((sum, log) => sum + Number(log.quantity), 0);
  const totalAllTimePackets = logs.reduce((sum, log) => sum + Number(log.quantity), 0);

  const filteredLogs = logs.filter(log => {
    if (!dateFilter.start && !dateFilter.end) return true;
    const logDate = new Date(log.production_date);
    const start = dateFilter.start ? new Date(dateFilter.start) : new Date(0);
    const end = dateFilter.end ? new Date(dateFilter.end) : new Date(8640000000000000);
    return logDate >= start && logDate <= end;
  });

  const filteredEarned = filteredLogs.reduce((sum, log) => sum + Number(log.total_income), 0);
  const filteredPackets = filteredLogs.reduce((sum, log) => sum + Number(log.quantity), 0);
  
  const filteredProductsBreakdown = filteredLogs.reduce((acc, log) => {
    const name = log.product_id === null ? "Labor Cost" : (log.products?.name || `Product: ${log.product_id}`);
    if (!acc[name]) acc[name] = 0;
    acc[name] += Number(log.quantity);
    return acc;
  }, {});

  // Group by month
  const monthlyStats = logs.reduce((acc, log) => {
    const date = new Date(log.production_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const displayMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = { month: displayMonth, income: 0, packets: 0, sortKey: monthKey, products: {} };
    acc[monthKey].income += Number(log.total_income);
    acc[monthKey].packets += Number(log.quantity);
    
    const name = log.product_id === null ? "Labor Cost" : (log.products?.name || `Product: ${log.product_id}`);
    if (!acc[monthKey].products[name]) acc[monthKey].products[name] = 0;
    acc[monthKey].products[name] += Number(log.quantity);
    
    return acc;
  }, {});
  
  const monthlyStatsArray = Object.values(monthlyStats).map(m => {
    const payment = payments.find(p => p.month_key === m.sortKey);
    return { ...m, isPaid: !!payment, paymentDate: payment?.payment_date };
  }).sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  // Group detailed logs by date
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const key = log.production_date;
    if (!acc[key]) {
      acc[key] = { date: log.production_date, total_income: 0, total_quantity: 0, products: [] };
    }
    acc[key].products.push({
      id: log.id, 
      name: log.product_id === null ? "Labor Cost" : (log.products?.name || `Product ID: ${log.product_id}`),
      quantity: log.quantity, 
      rate: log.rate_per_packet, 
      income: log.total_income,
      payment_status: log.payment_status || 'paid'
    });
    acc[key].total_income += Number(log.total_income);
    acc[key].total_quantity += Number(log.quantity);
    return acc;
  }, {});
  const groupedLogsArray = Object.values(groupedLogs).sort((a,b) => new Date(b.date) - new Date(a.date));

  const searchedGroupedLogsArray = groupedLogsArray.filter(group => {
    if (!shiftSearchQuery) return true;
    const q = shiftSearchQuery.toLowerCase();
    const dateStr = new Date(group.date).toLocaleDateString().toLowerCase();
    if (group.date.includes(q) || dateStr.includes(q)) return true;
    return group.products.some(p => p.name.toLowerCase().includes(q));
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="text-primary font-bold animate-pulse">Loading Worker Profile...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=e8f5e9&color=1F5132&bold=true`} alt={worker.name} className="w-16 h-16 rounded-full border border-outline-variant object-cover shadow-sm shrink-0" />
          <div className="min-w-0">
            <h2 className="text-2xl font-black text-primary leading-tight truncate">{worker.name}</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-on-surface-variant font-medium mt-1">
              <span className="bg-surface-container px-2 py-0.5 rounded text-xs shrink-0">{worker.role}</span>
              <span className="shrink-0">Joined: {new Date(worker.created_at).toLocaleDateString()}</span>
              {worker.phone && <span className="shrink-0">• {worker.phone}</span>}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-bold px-4 py-2 rounded-lg flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Directory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date Filter & Results */}
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-lg">Payout Calculator</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm w-full sm:w-auto">
              <input type="date" max={todayStr} value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} className="p-1 border rounded min-w-[120px] flex-1 sm:flex-none" />
              <span className="text-on-surface-variant font-medium">to</span>
              <input type="date" max={todayStr} value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} className="p-1 border rounded min-w-[120px] flex-1 sm:flex-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="text-sm font-semibold text-primary/80 mb-1">Filtered Income</div>
              <div className="text-3xl font-black text-primary">₹{filteredEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant h-full flex flex-col">
              <div className="text-sm font-semibold text-on-surface-variant mb-1">
                {worker.role === 'Labor' ? 'Filtered Days Logged' : 'Filtered Packets'}
              </div>
              <div className="text-3xl font-black mb-3">{filteredPackets.toLocaleString()}</div>
              
              <div className="mt-auto pt-3 border-t border-outline-variant/50 space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                {Object.entries(filteredProductsBreakdown).length === 0 ? (
                  <div className="text-xs text-on-surface-variant italic">No packets in range</div>
                ) : (
                  Object.entries(filteredProductsBreakdown).map(([name, qty]) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant truncate mr-2" title={name}>{name}</span>
                      <span className="font-bold text-on-surface whitespace-nowrap">
                        {qty.toLocaleString()} {name === 'Labor Cost' ? 'days' : 'pkts'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All-Time Stats */}
        <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-4">All-Time Totals</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-error flex items-center gap-1">
                Outstanding Unpaid 
                {totalAllTimeUnpaidItems > 0 && (
                  <span className="font-normal opacity-80">
                    ({totalAllTimeUnpaidItems} {worker.role === 'Labor' ? (totalAllTimeUnpaidItems === 1 ? 'day' : 'days') : 'pkts'})
                  </span>
                )}
              </div>
              <div className="text-xl font-black text-error">₹{totalAllTimeUnpaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface-variant">Total Income Logged</div>
              <div className="text-xl font-black text-primary">₹{totalAllTimeEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface-variant">
                {worker.role === 'Labor' ? 'Total Days Logged' : 'Total Packets'}
              </div>
              <div className="text-xl font-black">{totalAllTimePackets.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Full Filtered Logs */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-lg">Detailed Shift Logs <span className="text-sm font-normal text-on-surface-variant">(Filtered)</span></h3>
            
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search date or product..." 
                value={shiftSearchQuery}
                onChange={e => setShiftSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-low"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 w-full max-w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-on-surface-variant bg-surface-container-low">
                  <th className="py-3 px-4 rounded-tl-lg">Date</th>
                  <th className="py-3 px-4">Products Manufactured</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Day Total</th>
                </tr>
              </thead>
              <tbody>
                {searchedGroupedLogsArray.length === 0 ? (
                  <tr><td colSpan="3" className="py-8 text-center text-on-surface-variant">No logs match your criteria.</td></tr>
                ) : (
                  searchedGroupedLogsArray.map(group => (
                    <tr key={group.date} className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low/30">
                      <td className="py-3 px-4 text-sm font-bold align-top">{new Date(group.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col gap-2 min-w-[300px]">
                          {group.products.map(p => (
                            <div key={p.id} className={`text-sm bg-surface-container py-2 px-3 rounded-lg flex justify-between items-center gap-4 ${p.payment_status === 'unpaid' ? 'border-l-4 border-l-error' : 'border-l-4 border-l-primary'}`}>
                              <div>
                                <div className="font-bold flex items-center gap-2">
                                  {p.name}
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${p.payment_status === 'unpaid' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                    {p.payment_status || 'paid'}
                                  </span>
                                </div>
                                <div className="text-xs text-on-surface-variant">{p.quantity.toLocaleString()} x ₹{Number(p.rate).toFixed(2)}</div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="font-bold text-primary">₹{Number(p.income).toFixed(2)}</div>
                                {p.payment_status === 'unpaid' && (
                                  <button onClick={() => handleMarkAsPaid(p.id)} className="text-[10px] bg-error hover:bg-red-600 text-white px-2 py-0.5 rounded transition-colors shadow-sm">Mark Paid</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary align-top pt-5">₹{Number(group.total_income).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4">Monthly History</h3>
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-on-surface-variant">
                  <th className="pb-3 pr-2">Month</th>
                  <th className="pb-3 px-2 text-right">{worker.role === 'Labor' ? 'Days' : 'Packets'}</th>
                  <th className="pb-3 pl-2 text-right">Income</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStatsArray.length === 0 ? (
                  <tr><td colSpan="3" className="py-4 text-center text-on-surface-variant text-sm">No monthly data.</td></tr>
                ) : (
                  monthlyStatsArray.map(m => (
                    <tr key={m.sortKey} className="border-b border-outline-variant/50 last:border-0 align-top">
                      <td className="py-3 pr-2">
                        <div className="font-bold text-sm text-on-surface">{m.month}</div>
                        <div className="mt-1.5 space-y-1 border-t border-outline-variant/30 pt-1.5">
                          {Object.entries(m.products).map(([name, qty]) => (
                            <div key={name} className="flex justify-between items-center text-[10px] text-on-surface-variant gap-2">
                              <span className="truncate max-w-[80px]" title={name}>{name}</span>
                              <span className="font-semibold">{qty.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-sm text-secondary">{m.packets.toLocaleString()}</td>
                      <td className="py-3 pl-2 text-right font-bold text-primary text-sm flex flex-col items-end gap-1">
                        <div>₹{m.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        {m.isPaid ? (
                          <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-green-200" title={`Paid on ${new Date(m.paymentDate).toLocaleDateString()}`}>
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            PAID
                          </div>
                        ) : (
                          <button onClick={() => handleMarkPaid(m.sortKey, m.income)} className="text-[10px] bg-primary text-white font-bold px-2 py-1 rounded hover:bg-opacity-90 transition-colors">
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
