import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id, newStatus) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert("Error updating review: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Error deleting review: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredReviews = reviews.filter(r => r.status === activeTab);

  const getTabClass = (tabName) => {
    return activeTab === tabName 
      ? "px-6 py-3 border-b-2 border-primary text-primary font-bold bg-primary/5"
      : "px-6 py-3 border-b-2 border-transparent text-on-surface-variant hover:text-primary transition-colors cursor-pointer";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-headline-md font-bold text-primary mb-2">Customer Reviews Moderation</h2>
          <p className="text-on-surface-variant">Review and approve customer testimonials before they appear on the homepage.</p>
        </div>
        <button onClick={fetchReviews} className="flex items-center gap-2 text-primary hover:bg-primary-container px-4 py-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined">refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-error rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p className="font-bold">Database Error</p>
            <p>{error}</p>
            <p className="text-sm mt-2 opacity-80">Make sure the 'reviews' table has been created in your Supabase project.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-outline-variant mb-6">
        <button className={getTabClass("pending")} onClick={() => setActiveTab("pending")}>
          Pending ({reviews.filter(r => r.status === 'pending').length})
        </button>
        <button className={getTabClass("approved")} onClick={() => setActiveTab("approved")}>
          Approved ({reviews.filter(r => r.status === 'approved').length})
        </button>
        <button className={getTabClass("rejected")} onClick={() => setActiveTab("rejected")}>
          Rejected ({reviews.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
            <span className="material-symbols-outlined text-4xl text-outline mb-4">rate_review</span>
            <p className="text-on-surface-variant text-lg">No {activeTab} reviews found.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-6">
              
              {/* Review Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={review.imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}`} alt={review.name} className="w-12 h-12 rounded-full border border-outline-variant object-cover" />
                    <div>
                      <h4 className="font-bold text-on-surface text-lg">{review.name}</h4>
                      <p className="text-label-sm text-on-surface-variant">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-secondary">
                    {[...Array(review.stars || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                </div>
                
                <p className="text-on-surface italic bg-surface-container-low p-4 rounded-lg mb-4">"{review.text}"</p>
                
                <div className="flex flex-wrap gap-4 text-label-sm text-on-surface-variant">
                  <div className="flex items-center gap-1 bg-surface-container py-1 px-3 rounded-md border border-outline-variant">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    {review.email}
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container py-1 px-3 rounded-md border border-outline-variant">
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    Order ID: {review.orderId}
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container py-1 px-3 rounded-md border border-outline-variant">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-3 min-w-[140px] justify-center md:border-l md:border-outline-variant md:pl-6">
                {activeTab !== 'approved' && (
                  <button 
                    disabled={isProcessing}
                    onClick={() => updateReviewStatus(review.id, 'approved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve
                  </button>
                )}
                
                {activeTab !== 'rejected' && (
                  <button 
                    disabled={isProcessing}
                    onClick={() => updateReviewStatus(review.id, 'rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-error-container text-error py-2 px-4 rounded-lg hover:bg-error hover:text-white transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Reject
                  </button>
                )}
                
                <button 
                  disabled={isProcessing}
                  onClick={() => deleteReview(review.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-error text-error py-2 px-4 rounded-lg hover:bg-error/10 transition-colors mt-auto disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
