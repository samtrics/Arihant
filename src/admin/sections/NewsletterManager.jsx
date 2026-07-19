import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubscribers(data || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load subscribers. Ensure the database table exists.");
    } finally {
      setLoading(false);
    }
  };

  const copyAllEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('All emails copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Newsletter Subscribers</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your newsletter audience and export emails.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSubscribers}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
          <button
            onClick={copyAllEmails}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
            Copy All Emails
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-[32px]">mail</span>
          </div>
          <h3 className="text-lg font-bold mb-2">No subscribers yet</h3>
          <p className="text-on-surface-variant max-w-sm">
            When visitors subscribe through the footer form, their emails will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-bold text-on-surface">Total Subscribers: {subscribers.length}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant text-sm border-b border-outline-variant">
                  <th className="px-6 py-4 font-medium">Email Address</th>
                  <th className="px-6 py-4 font-medium">Date Subscribed</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/50">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-on-surface">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(sub.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary-container/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {sub.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
