import React, { useState, useEffect } from "react";
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
import { initialProducts } from "./admin/mockData";
import ProductDetailsModal from "./components/ProductDetailsModal";
import DistributorLogin from "./components/DistributorLogin";
import DistributorDashboard from "./components/DistributorDashboard";
import { socket } from "./socket";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [adminUser, setAdminUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const handleSync = (state) => {
      if (state.products) {
        setProducts(state.products);
      }
    };
    socket.on('SYNC_STATE', handleSync);
    return () => socket.off('SYNC_STATE', handleSync);
  }, []);

  const handleSetProducts = (newValOrUpdater) => {
    setProducts(prev => {
      const updated = typeof newValOrUpdater === 'function' ? newValOrUpdater(prev) : newValOrUpdater;
      socket.emit('UPDATE_STATE', { key: 'products', data: updated });
      return updated;
    });
  };


  const handleNavigate = (page, sectionId) => {
    setCurrentPage(page);
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
      {!isAdminPage && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main>
        {currentPage === "home" && (
          <div className="page-transition">
            <Hero />
            <ProductShowcase products={products} onProductClick={setSelectedProduct} />
            <PromiseSection />
            <Heritage />
            <Testimonials />
          </div>
        )}
        {currentPage === "about" && <About onNavigate={handleNavigate} />}
        {currentPage === "products" && <Products products={products} onNavigate={handleNavigate} onProductClick={setSelectedProduct} />}
        {currentPage === "contact" && <Contact onNavigate={handleNavigate} />}
        {currentPage === "distributors" && <Distributor onNavigate={handleNavigate} />}
        {(currentPage === "login" || currentPage === "register") && <Auth onNavigate={handleNavigate} initialMode={currentPage === "login" ? "signin" : "signup"} />}
        {currentPage === "distributor-login" && <DistributorLogin onNavigate={handleNavigate} />}
        {currentPage === "distributor-dashboard" && <DistributorDashboard products={products} onLogout={() => handleNavigate("home")} />}
        {currentPage === "admin" && (
          <AdminLogin
            onLogin={(user) => { setAdminUser(user); setCurrentPage("admin-dashboard"); }}
            onBack={() => setCurrentPage("home")}
          />
        )}
        {currentPage === "admin-dashboard" && adminUser && (
          <AdminDashboard
            adminUser={adminUser}
            onLogout={() => { setAdminUser(null); setCurrentPage("home"); }}
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

