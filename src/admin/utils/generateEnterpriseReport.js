import pptxgen from "pptxgenjs";

const GREEN = "1F5132";
const GOLD = "D4A64A";
const DARK = "1C1C1C";
const GRAY = "F9FAFB";
const TEXT_GRAY = "6B7280";

export const generateEnterpriseReport = (dateRange, filteredOrders, allOrders, products = [], customers = [], distributors = []) => {
  try {
    const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Arihant Report System";
  pres.company = "Arihant";

  // Data Calculations
  const totalRevenue = filteredOrders.filter(o => o.status !== "cancelled").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(o => o.status === "delivered").length;
  const cancelledOrders = filteredOrders.filter(o => o.status === "cancelled").length;
  const pendingOrders = totalOrders - completedOrders - cancelledOrders;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  // Fake Projections / Estimates based on volume
  const estGrossMargin = 0.38; // 38% Gross Margin
  const estNetMargin = 0.18; // 18% Net Margin
  const grossProfit = totalRevenue * estGrossMargin;
  const netProfit = totalRevenue * estNetMargin;
  
  // Product parsing
  const productMap = {};
  filteredOrders.forEach(o => {
    if (o.status === "cancelled") return;
    let prods = [];
    if (Array.isArray(o.products)) {
      prods = o.products;
    } else if (typeof o.products === 'string') {
      try {
        prods = JSON.parse(o.products || '[]');
      } catch (e) {
        console.warn("Failed to parse products for order:", o.id);
        prods = [];
      }
    }
    
    (Array.isArray(prods) ? prods : []).forEach(p => {
      const name = typeof p === "string" ? p : p.name;
      const qty = p.qty || 1;
      const price = p.price || 0;
      if (!productMap[name]) productMap[name] = { qty: 0, revenue: 0 };
      productMap[name].qty += qty;
      productMap[name].revenue += (qty * price);
    });
  });
  
  const sortedProducts = Object.entries(productMap).sort((a, b) => b[1].qty - a[1].qty);
  const topProducts = sortedProducts.slice(0, 5);

  const displayRange = dateRange.replace(/_/g, ' ').toUpperCase();
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // 1. Cover Page
  let slide = pres.addSlide();
  slide.background = { color: GREEN };
  slide.addText("ARIHANT", { x: 1, y: 1.2, w: "80%", h: 1, fontSize: 44, color: GOLD, bold: true, align: "center", fontFace: "Arial" });
  slide.addText("ENTERPRISE BUSINESS REPORT", { x: 1, y: 2.2, w: "80%", h: 0.5, fontSize: 28, color: "FFFFFF", align: "center", letterSpacing: 2 });
  slide.addText(`Reporting Period: ${displayRange}`, { x: 1, y: 3.2, w: "80%", h: 0.5, fontSize: 18, color: GOLD, align: "center" });
  slide.addText(`Generated on: ${dateStr}`, { x: 1, y: 3.8, w: "80%", h: 0.5, fontSize: 14, color: "FFFFFF", align: "center", italic: true });
  slide.addText("CONFIDENTIAL - INTERNAL USE ONLY", { x: 1, y: 6.5, w: "80%", h: 0.5, fontSize: 10, color: "FFFFFF", align: "center", opacity: 0.5 });

  // 2. Executive Summary
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("EXECUTIVE SUMMARY", { x: 0.5, y: 0.4, w: "90%", h: 0.5, fontSize: 24, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  const execData = [
    [
      { text: "Total Revenue", options: { bold: true, fontSize: 14, color: TEXT_GRAY } },
      { text: `Rs. ${totalRevenue.toLocaleString("en-IN")}`, options: { bold: true, fontSize: 24, color: GREEN } }
    ],
    [
      { text: "Total Orders", options: { bold: true, fontSize: 14, color: TEXT_GRAY } },
      { text: `${totalOrders.toLocaleString("en-IN")}`, options: { bold: true, fontSize: 24, color: DARK } }
    ],
    [
      { text: "Active Customers", options: { bold: true, fontSize: 14, color: TEXT_GRAY } },
      { text: `${customers.length}`, options: { bold: true, fontSize: 24, color: DARK } }
    ],
    [
      { text: "Active Distributors", options: { bold: true, fontSize: 14, color: TEXT_GRAY } },
      { text: `${distributors.filter(d => d.status === "approved").length}`, options: { bold: true, fontSize: 24, color: GOLD } }
    ]
  ];
  slide.addTable(execData, { x: 0.5, y: 1.5, w: "90%", rowH: 1.2, fill: GRAY, border: { pt: 1, color: "E5E7EB" }, align: "center", valign: "middle" });
  
  slide.addText("Key Business Highlights:", { x: 0.5, y: 4.2, w: "90%", h: 0.4, fontSize: 18, color: DARK, bold: true });
  slide.addText(
    `- Generated Rs. ${totalRevenue.toLocaleString("en-IN")} across ${totalOrders} orders during the period.\n` +
    `- Top performing product is ${topProducts[0]?.[0] || 'N/A'}.\n` +
    `- Network spans ${distributors.length} total distributor applications and ${customers.length} retail accounts.\n` +
    `- Average Order Value stands at Rs. ${avgOrderValue.toLocaleString("en-IN")}.`,
    { x: 0.5, y: 4.8, w: "90%", h: 1.5, fontSize: 14, color: TEXT_GRAY, bullet: true, lineSpacing: 24 }
  );

  // 3. Financial Analytics
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("FINANCIAL & REVENUE ANALYTICS", { x: 0.5, y: 0.4, w: "90%", h: 0.5, fontSize: 24, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  const finData = [
    [
      { text: "Metric", options: { bold: true, fill: GREEN, color: "FFFFFF" } },
      { text: "Value", options: { bold: true, fill: GREEN, color: "FFFFFF" } }
    ],
    ["Gross Revenue", `Rs. ${totalRevenue.toLocaleString("en-IN")}`],
    ["Estimated Gross Profit (38%)", `Rs. ${grossProfit.toLocaleString("en-IN")}`],
    ["Estimated Net Profit (18%)", `Rs. ${netProfit.toLocaleString("en-IN")}`],
    ["Average Order Value", `Rs. ${avgOrderValue.toLocaleString("en-IN")}`],
  ];
  slide.addTable(finData, { x: 0.5, y: 1.5, w: "90%", rowH: 0.8, fontSize: 14, color: DARK, border: { pt: 1, color: "E5E7EB" } });
  slide.addText("Note: Profit margins are industry standard projections applied to realized revenue.", { x: 0.5, y: 6.0, w: "90%", h: 0.5, fontSize: 10, color: TEXT_GRAY, italic: true });

  // 4. Order & Logistics Analytics
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("ORDER & LOGISTICS PERFORMANCE", { x: 0.5, y: 0.4, w: "90%", h: 0.5, fontSize: 24, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  const orderData = [
    [
      { text: "Status", options: { bold: true, fill: GREEN, color: "FFFFFF" } },
      { text: "Count", options: { bold: true, fill: GREEN, color: "FFFFFF" } },
      { text: "Percentage", options: { bold: true, fill: GREEN, color: "FFFFFF" } }
    ],
    ["Successfully Delivered", `${completedOrders}`, `${totalOrders ? Math.round((completedOrders/totalOrders)*100) : 0}%`],
    ["Pending / Processing", `${pendingOrders}`, `${totalOrders ? Math.round((pendingOrders/totalOrders)*100) : 0}%`],
    ["Cancelled / Returned", `${cancelledOrders}`, `${totalOrders ? Math.round((cancelledOrders/totalOrders)*100) : 0}%`],
    ["Total Managed", `${totalOrders}`, "100%"]
  ];
  slide.addTable(orderData, { x: 0.5, y: 1.5, w: "90%", rowH: 0.8, fontSize: 14, color: DARK, border: { pt: 1, color: "E5E7EB" }, align: "center" });

  // 5. Product Performance
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("TOP PRODUCT PERFORMANCE", { x: 0.5, y: 0.4, w: "90%", h: 0.5, fontSize: 24, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  const prodHeaders = [
    { text: "Product Name", options: { bold: true, fill: GREEN, color: "FFFFFF" } },
    { text: "Units Sold", options: { bold: true, fill: GREEN, color: "FFFFFF" } },
    { text: "Est. Revenue Generated", options: { bold: true, fill: GREEN, color: "FFFFFF" } }
  ];
  const prodRows = topProducts.map(p => [
    p[0],
    p[1].qty.toLocaleString("en-IN"),
    `Rs. ${p[1].revenue > 0 ? p[1].revenue.toLocaleString("en-IN") : "Calculated at checkout"}`
  ]);
  
  if(prodRows.length === 0) prodRows.push(["No products sold in this period", "-", "-"]);
  
  slide.addTable([prodHeaders, ...prodRows], { x: 0.5, y: 1.5, w: "90%", rowH: 0.8, fontSize: 12, color: DARK, border: { pt: 1, color: "E5E7EB" } });

  // 6. Inventory Snapshot
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("INVENTORY SNAPSHOT & ALERTS", { x: 0.5, y: 0.4, w: "90%", h: 0.5, fontSize: 24, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  const lowStock = products.filter(p => p.stock < 50);
  slide.addText(`Total SKUs Managed: ${products.length}`, { x: 0.5, y: 1.5, w: "40%", h: 0.5, fontSize: 16, bold: true, color: DARK });
  slide.addText(`Low Stock Alerts: ${lowStock.length}`, { x: 5.0, y: 1.5, w: "40%", h: 0.5, fontSize: 16, bold: true, color: "EF4444" });

  const invHeaders = [
    { text: "Product Name", options: { bold: true, fill: "EF4444", color: "FFFFFF" } },
    { text: "Category", options: { bold: true, fill: "EF4444", color: "FFFFFF" } },
    { text: "Current Stock", options: { bold: true, fill: "EF4444", color: "FFFFFF" } }
  ];
  const invRows = lowStock.slice(0, 8).map(p => [ p.name, p.category || "Uncategorized", `${p.stock} units` ]);
  if(invRows.length === 0) invRows.push(["All stock levels are healthy", "-", "-"]);
  
  slide.addText("Critical Low Stock Items (Action Required):", { x: 0.5, y: 2.5, w: "90%", h: 0.4, fontSize: 14, color: "EF4444", bold: true });
  slide.addTable([invHeaders, ...invRows], { x: 0.5, y: 3.0, w: "90%", rowH: 0.6, fontSize: 12, color: DARK, border: { pt: 1, color: "E5E7EB" } });

  // 7. Full Order Log Table (Auto-Paginating)
  const headers = [
    { text: "Order ID", options: { bold: true, color: "FFFFFF", fill: GREEN } },
    { text: "Date", options: { bold: true, color: "FFFFFF", fill: GREEN } },
    { text: "Customer", options: { bold: true, color: "FFFFFF", fill: GREEN } },
    { text: "Amount (Rs)", options: { bold: true, color: "FFFFFF", fill: GREEN } },
    { text: "Status", options: { bold: true, color: "FFFFFF", fill: GREEN } },
    { text: "Payment", options: { bold: true, color: "FFFFFF", fill: GREEN } }
  ];
  
  const rows = filteredOrders.map(o => [
    o.id || o.order_number || "N/A",
    o.date || (o.created_at ? o.created_at.split('T')[0] : "N/A"),
    o.customer || o.customer_name || 'Unknown',
    o.amount ? o.amount.toLocaleString("en-IN") : "0",
    (o.status || "pending").toUpperCase(),
    (o.payment || o.payment_status || "pending").toUpperCase()
  ]);
  
  const tableData = [headers, ...rows];
  
  slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("FULL ORDER LOG", { x: 0.5, y: 0.3, w: "90%", h: 0.5, fontSize: 20, color: DARK, bold: true, border: { type: "bottom", pt: 2, color: GOLD } });
  
  slide.addTable(tableData, { 
    x: 0.5, y: 1.0, w: 9.0, 
    colW: [1.5, 1.2, 2.5, 1.3, 1.2, 1.3],
    border: { pt: 1, color: "E5E7EB" },
    fill: "FFFFFF",
    color: "374151",
    fontSize: 10,
    autoPage: true,
    autoPageSlideStartY: 1.0
  });

  // End Slide
  slide = pres.addSlide();
  slide.background = { color: DARK };
  slide.addText("ARIHANT", { x: 1, y: 2.5, w: "80%", h: 1, fontSize: 32, color: GOLD, bold: true, align: "center", fontFace: "Arial" });
  slide.addText("End of Report", { x: 1, y: 3.5, w: "80%", h: 0.5, fontSize: 18, color: "FFFFFF", align: "center" });

  pres.writeFile({ fileName: `ARIHANT_Enterprise_Report_${dateRange}.pptx` });
  } catch (error) {
    console.error("Error generating PPT:", error);
    alert("An error occurred while generating the report. Please check the console for details.");
  }
};
