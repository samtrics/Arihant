import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword({ onNavigate }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onNavigate("customer-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] text-on-surface flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1F5132]/10 text-[#1F5132] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">lock_reset</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1C]">Reset Password</h2>
          <p className="text-gray-500 mt-2 text-sm">Enter a new strong password for your account.</p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
            <span className="material-symbols-outlined text-green-500 text-4xl mb-2">check_circle</span>
            <h3 className="text-lg font-bold text-green-800">Password Updated!</h3>
            <p className="text-green-600 text-sm mt-1">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] outline-none"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] outline-none"
                placeholder="Type password again"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-[#1F5132] text-white font-bold rounded-xl hover:bg-[#1a4328] transition-colors disabled:opacity-70 mt-2"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
