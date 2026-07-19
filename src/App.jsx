import React, { useState, useEffect, useRef, Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import PromiseSection from "./components/Promise";
import Heritage from "./components/Heritage";
import Testimonials from "./components/Testimonials";
import About from "./components/About";















import { supabase } from "./supabaseClient";
import SEO from "./components/SEO";
import { Capacitor } from '@capacitor/core';

// KICK OFF CRITICAL FETCH IMMEDIATELY TO BREAK NETWORK CHAIN
const initialProductsPromise = supabase.from('products').select('*').order('id');

const Products = React.lazy(() => import("./components/Products"));
const Contact = React.lazy(() => import("./components/Contact"));
const Auth = React.lazy(() => import("./components/Auth"));
const Distributor = React.lazy(() => import("./components/Distributor"));
const DistributorLogin = React.lazy(() => import("./components/DistributorLogin"));
const ResetPassword = React.lazy(() => import("./components/ResetPassword"));
const DistributorDashboard = React.lazy(() => import("./components/DistributorDashboard"));
const CustomerDashboard = React.lazy(() => import("./components/CustomerDashboard"));
const AdminLogin = React.lazy(() => import("./admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./admin/AdminDashboard"));
const Footer = React.lazy(() => import("./components/Footer"));
const ProductDetailsModal = React.lazy(() => import("./components/ProductDetailsModal"));
const CartDrawer = React.lazy(() => import("./components/CartDrawer"));
export default function App() {
  const checkAuthRedirect = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    return hash.includes('access_token=') || hash.includes('type=signup') || hash.includes('type=recovery') || search.includes('error_code=');
  };

  const [currentPage, setCurrentPage] = useState(() => {
    if (checkAuthRedirect()) return 'customer-dashboard';
    
    // Check session validity on load
    const saved = localStorage.getItem('adminSession');
    if (saved) {
      try {
        const sessionData = JSON.parse(saved);
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
          localStorage.removeItem('adminSession');
          return Capacitor.isNativePlatform() ? 'admin' : 'home';
        }
        return 'admin-dashboard';
      } catch (e) {
        return 'admin-dashboard';
      }
    }
    return Capacitor.isNativePlatform() ? 'admin' : 'home';
  });

  const [adminUser, setAdminUser] = useState(() => {
    if (checkAuthRedirect()) {
      localStorage.removeItem('adminSession');
      return null;
    }
    const saved = localStorage.getItem('adminSession');
    if (saved) {
      try {
        const sessionData = JSON.parse(saved);
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
          localStorage.removeItem('adminSession');
          return null;
        }
        // Extend session on reload to keep it active
        sessionData.expiresAt = Date.now() + 10 * 60 * 1000;
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        return sessionData.user || sessionData;
      } catch (e) {
        return JSON.parse(saved);
      }
    }
    return null;
  });

  const [distributorUser, setDistributorUser] = useState(() => {
    if (checkAuthRedirect()) return null;
    const saved = localStorage.getItem('distributorSession');
    if (saved) {
      try {
        const sessionData = JSON.parse(saved);
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
          localStorage.removeItem('distributorSession');
          return null;
        }
        sessionData.expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        localStorage.setItem('distributorSession', JSON.stringify(sessionData));
        return sessionData.user;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [customerUser, setCustomerUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Flours (Atta)", "Grains & Pulses", "Spices (Masala)", "Roasted Daliya", "Rice Varieties"]); // Default fallback
  const [siteSettings, setSiteSettings] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  const currentPageRef = useRef(currentPage);
  const setPage = (page) => {
    currentPageRef.current = page;
    setCurrentPage(page);
  };

  const setAdminUserAndPersist = (user) => {
    if (user) {
      const sessionData = {
        user,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
      };
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      setCustomerUser(null);
      setDistributorUserAndPersist(null);
    } else {
      localStorage.removeItem('adminSession');
      supabase.auth.signOut();
    }
    setAdminUser(user);
  };

  const setDistributorUserAndPersist = (user) => {
    if (user) {
      const sessionData = {
        user,
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour expiry
      };
      localStorage.setItem('distributorSession', JSON.stringify(sessionData));
      setCustomerUser(null);
      setAdminUserAndPersist(null);
    } else {
      localStorage.removeItem('distributorSession');
    }
    setDistributorUser(user);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isAdmin = !!localStorage.getItem('adminSession');
      const isDistributor = !!localStorage.getItem('distributorSession');
      setCustomerUser(isAdmin || isDistributor ? null : (session?.user || null));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAdmin = !!localStorage.getItem('adminSession');
      const isDistributor = !!localStorage.getItem('distributorSession');
      setCustomerUser(isAdmin || isDistributor ? null : (session?.user || null));

      if (event === 'PASSWORD_RECOVERY') {
        setPage('reset-password');
        return; // Prevent SIGNED_IN logic below from overriding this
      }

      if (event === 'SIGNED_IN') {
        const page = currentPageRef.current;
        // Skip redirect if admin is active OR if on any admin/distributor page
        const isAdminFlow = !!localStorage.getItem('adminSession') || page === 'admin' || page === 'admin-dashboard' || page === 'distributor-login' || page === 'distributor-dashboard';
        if (!isAdminFlow && page !== 'reset-password') {
          setPage('customer-dashboard');
          const url = new URL(window.location);
          url.searchParams.set('page', 'customer-dashboard');
          window.history.replaceState({ page: 'customer-dashboard' }, '', url);
        }
      }

      if (event === 'SIGNED_OUT') {
        // Only redirect to home if not in admin or distributor flows
        const page = currentPageRef.current;
        if (page !== 'admin-dashboard' && page !== 'admin' && page !== 'distributor-dashboard' && page !== 'distributor-login') {
          setPage(Capacitor.isNativePlatform() ? 'admin' : 'home');
        }
      }
    });

    // 10 minute auto-logout interval for Admin
    const checkSessionInterval = setInterval(() => {
      const saved = localStorage.getItem('adminSession');
      if (saved) {
        try {
          const sessionData = JSON.parse(saved);
          if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
            setAdminUserAndPersist(null);
            setPage(Capacitor.isNativePlatform() ? 'admin' : 'home');
            alert("Session expired due to inactivity. Please log in again.");
          }
        } catch (e) {}
      }
    }, 60000); // check every minute

    // Throttle function for activity tracking
    let lastActivityTime = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      // Only update local storage at most once every minute to prevent thrashing
      if (now - lastActivityTime > 60000) {
        const saved = localStorage.getItem('adminSession');
        if (saved) {
          try {
            const sessionData = JSON.parse(saved);
            if (sessionData.expiresAt && now <= sessionData.expiresAt) {
              sessionData.expiresAt = now + 10 * 60 * 1000; // Extend by 10 mins
              localStorage.setItem('adminSession', JSON.stringify(sessionData));
              lastActivityTime = now;
            }
          } catch(e) {}
        }
      }
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      subscription.unsubscribe();
      clearInterval(checkSessionInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Load products from Supabase and subscribe to realtime changes
  useEffect(() => {
    const mapProduct = (p) => {
      let images = [];
      try {
        images = JSON.parse(p.img_src);
        if (!Array.isArray(images)) images = [p.img_src];
      } catch(e) {
        if (p.img_src && p.img_src.includes(',')) {
           images = p.img_src.split(',').map(s=>s.trim());
        } else {
           images = [p.img_src].filter(Boolean);
        }
      }
      return {
        ...p,
        offerPrice: p.offer_price,
        imgSrc: images[0] || p.img_src,
        images: images,
        desc: p.description,
        tags: p.tags || [],
      };
    };

    // Initial fetch from the global promise to save 1000+ ms in the network chain
    initialProductsPromise.then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setProducts(data.map(mapProduct));
      }
    });

    // Realtime subscription for products
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        supabase.from('products').select('*').order('id').then(({ data }) => {
          if (data && data.length > 0) {
            setProducts(data.map(mapProduct));
          }
        });
      })
      .subscribe();

    // Fetch dynamic categories
    supabase.from('product_categories').select('name').order('created_at').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setCategories(data.map(c => c.name));
      }
    });

    // Realtime subscription for categories
    const catChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_categories' }, () => {
        supabase.from('product_categories').select('name').order('created_at').then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setCategories(data.map(c => c.name));
          }
        });
      })
      .subscribe();

    // Fetch site settings
    supabase.from('site_settings').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const settingsMap = {};
        data.forEach(row => { settingsMap[row.key] = row.value; });
        setSiteSettings(settingsMap);
      }
    });

    // Realtime subscription for site settings
    const settingsChannel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        supabase.from('site_settings').select('*').then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const settingsMap = {};
            data.forEach(row => { settingsMap[row.key] = row.value; });
            setSiteSettings(settingsMap);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(catChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const handleSetProducts = async (newValOrUpdater) => {
    setProducts(newValOrUpdater);
    // Supabase realtime will sync automatically via subscription above
  };


  const handleNavigate = (page, sectionId, replace = false) => {
    console.log("handleNavigate called:", { page, sectionId, replace });
    setPage(page);
    
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    if (sectionId) url.searchParams.set('section', sectionId);
    else url.searchParams.delete('section');

    if (replace) {
      window.history.replaceState({ page, sectionId }, '', url);
    } else {
      window.history.pushState({ page, sectionId }, '', url);
    }

    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page);
        if (event.state.sectionId) {
          setTimeout(() => {
            const element = document.getElementById(event.state.sectionId);
            if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || (localStorage.getItem('adminSession') ? 'admin-dashboard' : (Capacitor.isNativePlatform() ? 'admin' : 'home'));
        setPage(page);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || currentPageRef.current;
    
    if (!window.history.state) {
      const url = new URL(window.location);
      url.searchParams.set('page', initialPage);
      window.history.replaceState({ page: initialPage }, '', url);
    }
    
    if (urlParams.get('page') && urlParams.get('page') !== currentPageRef.current) {
      setPage(urlParams.get('page'));
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Reset scroll position to top instantly on page change
    window.scrollTo({ top: 0, behavior: "auto" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [currentPage]);

  useEffect(() => {
    // If user is already logged in but URL says 'admin', redirect to 'admin-dashboard'
    if (currentPage === "admin" && adminUser) {
      handleNavigate("admin-dashboard", null, true);
    }
    // If distributor is already logged in but URL says 'distributor-login', redirect to 'distributor-dashboard'
    if (currentPage === "distributor-login" && distributorUser) {
      handleNavigate("distributor-dashboard", null, true);
    }
  }, [currentPage, adminUser, distributorUser]);

  const isAdminPage = currentPage === "admin" || currentPage === "admin-dashboard" || currentPage === "distributor-login" || currentPage === "distributor-dashboard";

  // Public products for customers & distributors (shows only 80% of actual stock to create buffer/scarcity)
  const publicProducts = React.useMemo(() => {
    return products.map(p => ({
      ...p,
      stock: typeof p.stock === 'number' ? Math.floor(p.stock * 0.8) : p.stock
    }));
  }, [products]);

  return (
    <>
      <SEO />
      {!isAdminPage && <Header currentPage={currentPage} onNavigate={handleNavigate} customerUser={customerUser} onSearch={(q) => { setGlobalSearchQuery(q); handleNavigate('products'); }} />}
      <main>
        <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
        {currentPage === "home" && (
          <div className="page-transition">
            <Hero onNavigate={handleNavigate} />
            <ProductShowcase products={publicProducts} onProductClick={setSelectedProduct} onNavigate={handleNavigate} />
            <PromiseSection />
            <Heritage onNavigate={handleNavigate} />
            <Testimonials />
          </div>
        )}
        {currentPage === "about" && <About onNavigate={handleNavigate} siteSettings={siteSettings} />}
        {currentPage === "products" && <Products products={publicProducts} categories={categories} onNavigate={handleNavigate} onProductClick={setSelectedProduct} initialSearchQuery={globalSearchQuery} />}
        {currentPage === "contact" && <Contact onNavigate={handleNavigate} siteSettings={siteSettings} />}
        {currentPage === "distributors" && <Distributor onNavigate={handleNavigate} siteSettings={siteSettings} />}
        {(currentPage === "login" || currentPage === "register") && <Auth onNavigate={handleNavigate} initialMode={currentPage === "login" ? "signin" : "signup"} />}
        {currentPage === "customer-dashboard" && customerUser && <CustomerDashboard user={customerUser} onNavigate={handleNavigate} onLogout={() => handleNavigate("home")} />}
        {currentPage === "customer-dashboard" && !customerUser && <Auth onNavigate={handleNavigate} initialMode="signin" />}
        {currentPage === "reset-password" && <ResetPassword onNavigate={handleNavigate} />}
        {currentPage === "distributor-login" && !distributorUser && (
          <DistributorLogin 
            onLogin={(user) => { setDistributorUserAndPersist(user); handleNavigate("distributor-dashboard", null, true); }}
            onNavigate={handleNavigate} 
          />
        )}
        {currentPage === "distributor-dashboard" && distributorUser && (
          <DistributorDashboard 
            distributorUser={distributorUser} 
            products={publicProducts} 
            onLogout={() => { setDistributorUserAndPersist(null); handleNavigate("home"); }} 
          />
        )}
        {currentPage === "distributor-dashboard" && !distributorUser && (
          <DistributorLogin 
            onLogin={(user) => { setDistributorUserAndPersist(user); handleNavigate("distributor-dashboard", null, true); }}
            onNavigate={handleNavigate} 
          />
        )}
        {currentPage === "admin" && !adminUser && (
          <AdminLogin
            onLogin={(user) => { setAdminUserAndPersist(user); handleNavigate("admin-dashboard", null, true); }}
            onBack={() => handleNavigate("home", null, true)}
          />
        )}
        {currentPage === "admin-dashboard" && adminUser && (
          <AdminDashboard
            adminUser={adminUser}
            onLogout={() => { setAdminUserAndPersist(null); setPage(Capacitor.isNativePlatform() ? 'admin' : 'home'); }}
            products={products}
            setProducts={handleSetProducts}
            categories={categories}
            setCategories={setCategories}
            siteSettings={siteSettings}
          />
        )}
      
        </Suspense>
      </main>
      {!isAdminPage && <Suspense fallback={null}><Footer currentPage={currentPage} onNavigate={handleNavigate} /></Suspense>}
      {selectedProduct && <Suspense fallback={null}><ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} /></Suspense>}
      <Suspense fallback={null}><CartDrawer customerUser={customerUser} onNavigate={handleNavigate} /></Suspense>
    </>
  );
}

