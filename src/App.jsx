import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import PromiseSection from "./components/Promise";
import Heritage from "./components/Heritage";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Products from "./components/Products";
import Contact from "./components/Contact";
import Auth from "./components/Auth";
import Distributor from "./components/Distributor";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Footer from "./components/Footer";

import ProductDetailsModal from "./components/ProductDetailsModal";
import DistributorLogin from "./components/DistributorLogin";
import DistributorDashboard from "./components/DistributorDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import { socket } from "./socket";
import { supabase } from "./supabaseClient";

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Restore admin page on refresh
    return localStorage.getItem('adminSession') ? 'admin-dashboard' : 'home';
  });
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminSession');
    return saved ? JSON.parse(saved) : null;
  });
  const [customerUser, setCustomerUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // Track current page in a ref so auth listener always has the latest value
  const currentPageRef = useRef(localStorage.getItem('adminSession') ? 'admin-dashboard' : 'home');
  const setPage = (page) => {
    currentPageRef.current = page;
    setCurrentPage(page);
  };

  const setAdminUserAndPersist = (user) => {
    if (user) {
      localStorage.setItem('adminSession', JSON.stringify(user));
      setCustomerUser(null); // Ensure admin does not appear as a customer
    } else {
      localStorage.removeItem('adminSession');
      supabase.auth.signOut(); // Fully sign out of Supabase to prevent ghost customer sessions
    }
    setAdminUser(user);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isAdmin = !!localStorage.getItem('adminSession');
      setCustomerUser(isAdmin ? null : (session?.user || null));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAdmin = !!localStorage.getItem('adminSession');
      setCustomerUser(isAdmin ? null : (session?.user || null));

      if (event === 'SIGNED_IN') {
        const page = currentPageRef.current;
        // Skip redirect if admin is active OR if on any admin/distributor page
        const isAdminFlow = !!localStorage.getItem('adminSession') || page === 'admin' || page === 'admin-dashboard' || page === 'distributor-login' || page === 'distributor-dashboard';
        if (!isAdminFlow) {
          setPage('customer-dashboard');
        }
      }

      if (event === 'SIGNED_OUT') {
        // Only redirect to home if not in admin dashboard (admin handles its own logout)
        const page = currentPageRef.current;
        if (page !== 'admin-dashboard' && page !== 'admin') {
          setPage('home');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load products from Supabase and subscribe to realtime changes
  useEffect(() => {
    // Initial fetch
    supabase.from('products').select('*').order('id').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setProducts(data.map(p => ({
          ...p,
          offerPrice: p.offer_price,
          imgSrc: p.img_src,
          desc: p.description,
          tags: p.tags || [],
        })));
      }
    });

    // Realtime subscription
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        supabase.from('products').select('*').order('id').then(({ data }) => {
          if (data && data.length > 0) {
            setProducts(data.map(p => ({
              ...p,
              offerPrice: p.offer_price,
              imgSrc: p.img_src,
              desc: p.description,
              tags: p.tags || [],
            })));
          }
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleSetProducts = async (newValOrUpdater) => {
    setProducts(newValOrUpdater);
    // Supabase realtime will sync automatically via subscription above
  };


  const handleNavigate = (page, sectionId, replace = false) => {
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
        const page = urlParams.get('page') || (localStorage.getItem('adminSession') ? 'admin-dashboard' : 'home');
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

  const isAdminPage = currentPage === "admin" || currentPage === "admin-dashboard" || currentPage === "distributor-login" || currentPage === "distributor-dashboard";

  return (
    <>
      {!isAdminPage && <Header currentPage={currentPage} onNavigate={handleNavigate} customerUser={customerUser} />}
      <main>
        {currentPage === "home" && (
          <div className="page-transition">
            <Hero onNavigate={handleNavigate} />
            <ProductShowcase products={products} onProductClick={setSelectedProduct} onNavigate={handleNavigate} />
            <PromiseSection />
            <Heritage onNavigate={handleNavigate} />
            <Testimonials />
          </div>
        )}
        {currentPage === "about" && <About onNavigate={handleNavigate} />}
        {currentPage === "products" && <Products products={products} onNavigate={handleNavigate} onProductClick={setSelectedProduct} />}
        {currentPage === "contact" && <Contact onNavigate={handleNavigate} />}
        {currentPage === "distributors" && <Distributor onNavigate={handleNavigate} />}
        {(currentPage === "login" || currentPage === "register") && <Auth onNavigate={handleNavigate} initialMode={currentPage === "login" ? "signin" : "signup"} />}
        {currentPage === "customer-dashboard" && customerUser && <CustomerDashboard user={customerUser} onNavigate={handleNavigate} onLogout={() => handleNavigate("home")} />}
        {currentPage === "customer-dashboard" && !customerUser && <Auth onNavigate={handleNavigate} initialMode="signin" />}
        {currentPage === "distributor-login" && <DistributorLogin onNavigate={handleNavigate} />}
        {currentPage === "distributor-dashboard" && <DistributorDashboard products={products} onLogout={() => handleNavigate("home")} />}
        {currentPage === "admin" && (
          <AdminLogin
            onLogin={(user) => { setAdminUserAndPersist(user); setPage("admin-dashboard"); }}
            onBack={() => setPage("home")}
          />
        )}
        {currentPage === "admin-dashboard" && adminUser && (
          <AdminDashboard
            adminUser={adminUser}
            onLogout={() => { setAdminUserAndPersist(null); setPage("home"); }}
            products={products}
            setProducts={handleSetProducts}
          />
        )}
      </main>
      {!isAdminPage && <Footer currentPage={currentPage} onNavigate={handleNavigate} />}
      {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}

