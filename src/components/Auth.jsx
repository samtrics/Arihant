import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Auth({ onNavigate, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync mode with initialMode prop when it changes
  useEffect(() => {
    setMode(initialMode === "login" ? "signin" : initialMode === "register" ? "signup" : initialMode);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      agreeTerms: false
    });
  }, [initialMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    
    // Email Validation (both modes)
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // Password Validation (both modes)
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      tempErrors.password = "Must contain at least one letter and one number";
    }

    if (mode === "signup") {
      // Full Name Validation
      if (!formData.name.trim()) {
        tempErrors.name = "Full Name is required";
      }

      // Confirm Password
      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }

      // Agree to Terms
      if (!formData.agreeTerms) {
        tempErrors.agreeTerms = "You must agree to our Terms & Conditions";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, _general: "" }));
    
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name
            }
          }
        });
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;

        // Verify they are NOT an admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (adminData) {
          await supabase.auth.signOut();
          throw new Error("Admin accounts cannot log in here. Please use the Admin Portal.");
        }
      }

      setIsSubmitted(true);
      setSuccessMessage(
        mode === "signin" 
          ? `Welcome back! Taking you to your dashboard...`
          : `Account created! Welcome to Arihant. Please verify your email if required.`
      );

    } catch (err) {
      setErrors(prev => ({ ...prev, _general: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] text-on-surface flex items-center justify-center py-stack-xl px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      {/* Background grain detail */}
      <div className="grain-overlay opacity-[0.03]"></div>
      
      {/* Success Banner overlay when submitted */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-2xl max-w-md w-full mx-4 text-center transform scale-100 transition-all duration-300">
            <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h3 className="font-display-lg text-primary text-headline-lg mb-3">
              {mode === "signin" ? "Sign In Successful!" : "Registration Complete!"}
            </h3>
            <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
              {successMessage}
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-bold">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting to Arihant Purity Hub...</span>
            </div>
          </div>
        </div>
      )}

      {/* Auth Portal Panel Container */}
      <div className="w-full max-w-[1024px] bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-xl overflow-hidden flex flex-col lg:flex-row relative z-10">
        
        {/* Left Side: Brand Visual Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary text-white flex-col justify-between p-12 overflow-hidden select-none">
          {/* Background Image with optimized zoom and blend */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105 hover:scale-100"
            style={{ backgroundImage: "url('/auth_banner.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/95 mix-blend-multiply"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top Branding Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-secondary text-white font-label-sm text-label-sm rounded-full">
                  Since 1984
                </span>
                <span className="text-outline-variant font-bold text-label-sm">|</span>
                <span className="text-secondary-fixed-dim font-bold text-label-sm">Pure Grains</span>
              </div>
              <h2 className="font-display-lg text-[36px] font-bold leading-tight">
                Cultivating Trust,<br />
                <span className="text-secondary-fixed-dim italic">Milling Perfection.</span>
              </h2>
            </div>

            {/* Mid brand values overlay card */}
            <div className="my-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl space-y-4">
              <h4 className="font-headline-md text-[18px] text-secondary-fixed-dim font-bold">
                The Arihant Commitment
              </h4>
              <div className="space-y-3 font-body-md text-[15px]">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">verified</span>
                  <p className="opacity-90">100% Traceable Stone-Ground Heritage Milling</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">verified</span>
                  <p className="opacity-90">No Bleaching Agents, Additives, or Preservatives</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">verified</span>
                  <p className="opacity-90">Fair Compensation for Organic Farm Collectives</p>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-label-sm text-outline-variant">
              <span>© {new Date().getFullYear()} Arihant FMCG</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Inputs form */}
        <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          {/* Logo representation on mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="px-2 py-0.5 bg-primary text-white rounded font-bold text-label-sm">A</span>
            <span className="font-headline-md font-bold text-primary">ARIHANT</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-outline-variant mb-8 relative">
            <button
              onClick={() => {
                setMode("signin");
                setErrors({});
              }}
              className={`flex-1 pb-4 text-center font-headline-md text-[18px] transition-all relative ${
                mode === "signin" 
                  ? "text-primary font-bold" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Sign In
              {mode === "signin" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t animate-slide-in"></div>
              )}
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setErrors({});
              }}
              className={`flex-1 pb-4 text-center font-headline-md text-[18px] transition-all relative ${
                mode === "signup" 
                  ? "text-primary font-bold" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Create Account
              {mode === "signup" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t animate-slide-in"></div>
              )}
            </button>
          </div>

          {/* Core Header Text */}
          <div className="mb-6">
            <h3 className="font-headline-lg text-headline-lg text-primary mb-1">
              {mode === "signin" ? "Welcome Back" : "Join the Heritage"}
            </h3>
            <p className="text-body-md text-on-surface-variant">
              {mode === "signin"
                ? "Sign in to access your custom purity orders and member recipes."
                : "Create an account to track orders, save favorites, and receive milling logs."}
            </p>
            {errors._general && (
              <div className="mt-4 p-3 bg-error-container text-on-error-container rounded-lg flex items-start gap-2 border border-error/20">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span className="text-label-md font-medium">{errors._general}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field (Sign Up Only) */}
            {mode === "signup" && (
              <div className="space-y-1">
                <label htmlFor="name" className="block text-label-md text-on-surface font-semibold">
                  Full Name <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                    person
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.name ? "border-error" : "border-outline-variant"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-label-sm text-error font-medium">{errors.name}</p>}
              </div>
            )}

            {/* Email Field (Both modes) */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-label-md text-on-surface font-semibold">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.email ? "border-error" : "border-outline-variant"
                  }`}
                />
              </div>
              {errors.email && <p className="text-label-sm text-error font-medium">{errors.email}</p>}
            </div>

            {/* Password Field (Both modes) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-label-md text-on-surface font-semibold">
                  Password <span className="text-error">*</span>
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      alert("Simulating: A password reset link has been dispatched to your email!");
                    }}
                    className="text-label-sm text-secondary hover:text-primary hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter secure password"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.password ? "border-error" : "border-outline-variant"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors flex items-center justify-center p-0.5 rounded-full"
                  aria-label="Toggle Password Visibility"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && <p className="text-label-sm text-error font-medium">{errors.password}</p>}
              
              {/* Real-time hint under password on signup */}
              {mode === "signup" && !errors.password && formData.password.length > 0 && (
                <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant font-medium mt-1">
                  <span className="material-symbols-outlined text-xs text-primary-fixed-dim">info</span>
                  <span>Minimum 8 chars, 1 letter, 1 number</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {mode === "signup" && (
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-label-md text-on-surface font-semibold">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                    lock_reset
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.confirmPassword ? "border-error" : "border-outline-variant"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors flex items-center justify-center p-0.5 rounded-full"
                    aria-label="Toggle Confirm Password Visibility"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-label-sm text-error font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Remember Me / Agree to Terms Checkbox */}
            <div className="py-1">
              {mode === "signin" ? (
                <label className="flex items-center gap-2.5 cursor-pointer text-body-md select-none">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-[18px] h-[18px] accent-primary rounded border-outline-variant bg-surface-container-low cursor-pointer"
                  />
                  <span className="text-on-surface-variant font-medium">Keep me signed in on this device</span>
                </label>
              ) : (
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-body-md select-none">
                    <input
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-[18px] h-[18px] accent-primary rounded border-outline-variant bg-surface-container-low cursor-pointer shrink-0"
                    />
                    <span className="text-on-surface-variant font-medium text-[15px] leading-snug">
                      I certify that I agree to Arihant's{" "}
                      <a href="#" className="text-primary hover:underline font-bold">Terms of Service</a> and{" "}
                      <a href="#" className="text-primary hover:underline font-bold">Purity Guarantee Policy</a>.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-label-sm text-error font-medium pl-7">{errors.agreeTerms}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/10 transition-all active:scale-98 disabled:opacity-80 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {mode === "signin" ? "login" : "person_add"}
                  </span>
                  <span>{mode === "signin" ? "Sign In to Account" : "Register Purity Access"}</span>
                </>
              )}
            </button>
          </form>

          {/* Form Bottom Toggles */}
          <div className="mt-8 text-center text-body-md text-on-surface-variant font-medium border-t border-outline-variant/40 pt-6">
            {mode === "signin" ? (
              <p>
                Don't have an Arihant membership yet?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already registered with Arihant?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  Sign In Instead
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
