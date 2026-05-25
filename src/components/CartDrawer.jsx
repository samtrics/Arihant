import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

export default function CartDrawer({ customerUser, onNavigate }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!customerUser) {
      setIsCartOpen(false);
      onNavigate('login');
      return;
    }

    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase.from('orders').insert([{
        order_number: orderNumber,
        customer_name: customerUser.user_metadata?.full_name || customerUser.email.split('@')[0],
        customer_email: customerUser.email,
        amount: cartTotal,
        status: 'pending',
        products: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.offerPrice || item.price,
          unit: item.unit
        })))
      }]);

      if (error) throw error;

      clearCart();
      setOrderSuccess(true);
      
      setTimeout(() => {
        setOrderSuccess(false);
        setIsCartOpen(false);
        onNavigate('customer-dashboard');
      }, 3000);

    } catch (err) {
      console.error("Checkout failed:", err);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md w-full bg-surface-container-lowest shadow-2xl flex flex-col h-full animate-slide-in-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">shopping_cart</span>
              Your Cart
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {orderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-[40px]">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Order Placed Successfully!</h3>
                <p className="text-on-surface-variant mb-6">Thank you for your purchase. We are redirecting you to your dashboard to view your order details.</p>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[64px] mb-4 opacity-50">shopping_bag</span>
                <p className="text-lg font-medium">Your cart is currently empty.</p>
                <button 
                  onClick={() => { setIsCartOpen(false); onNavigate('products'); }}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-outline-variant pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/50 flex-shrink-0">
                      <img src={item.imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-on-surface leading-tight">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">{item.unit}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-outline-variant rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-primary hover:bg-surface-container transition-colors"
                          >-</button>
                          <span className="px-2 font-medium text-sm w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-primary hover:bg-surface-container transition-colors"
                          >+</button>
                        </div>
                        <span className="font-bold text-primary">₹{((item.offerPrice || item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {cartItems.length > 0 && !orderSuccess && (
            <div className="border-t border-outline-variant p-6 bg-surface-container-low">
              <div className="flex justify-between items-center mb-6">
                <span className="text-on-surface-variant font-medium text-lg">Subtotal</span>
                <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
              {!customerUser && (
                <p className="text-center text-xs text-on-surface-variant mt-3">
                  You will be asked to sign in to place your order.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
