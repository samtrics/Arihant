import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

export default function CartDrawer({ customerUser, onNavigate }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [address, setAddress] = useState({ flat: "", area: "", landmark: "", city: "", pincode: "" });
  const [phone, setPhone] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiTxnId, setUpiTxnId] = useState("");
  const [addressSelection, setAddressSelection] = useState("new");
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  const parseAddr = (a) => {
    if (typeof a === 'object' && a !== null) return { flat: a.flat || "", area: a.area || "", landmark: "", city: a.city || "", state: a.state || "", pincode: a.pincode || "" };
    if (typeof a === 'string' && a.trim() !== '') return { flat: "", area: a, landmark: "", city: "", state: "", pincode: "" };
    return null;
  };

  const primaryAddressObj = parseAddr(customerUser?.user_metadata?.address);
  const shopAddressObj = parseAddr(customerUser?.user_metadata?.shop_address);

  React.useEffect(() => {
    if (customerUser) {
      if (!phone) setPhone(customerUser.user_metadata?.phone || "");
      if (primaryAddressObj) setAddressSelection("primary");
    }
  }, [customerUser]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            setAddress(prev => ({
              ...prev,
              area: data.address.suburb || data.address.neighbourhood || data.address.road || "",
              city: data.address.city || data.address.town || data.address.state_district || "",
              pincode: data.address.postcode || ""
            }));
          }
        } catch (err) {
          console.error("Error fetching address:", err);
          alert("Could not fetch address automatically. Please enter it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please ensure location permissions are granted.");
        setIsLocating(false);
      }
    );
  };

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!customerUser) {
      setIsCartOpen(false);
      onNavigate('login');
      return;
    }

    if (cartItems.length === 0) return;
    
    let finalAddr = address;
    if (addressSelection === "primary" && primaryAddressObj) finalAddr = primaryAddressObj;
    else if (addressSelection === "shop" && shopAddressObj) finalAddr = shopAddressObj;

    if (!finalAddr.flat?.trim() || !finalAddr.area?.trim() || !finalAddr.city?.trim() || !finalAddr.pincode?.trim() || !phone.trim()) {
      alert("Please fill in all required delivery details (Flat, Area, City, Pincode, and Phone).");
      return;
    }
    if (paymentMethod === "UPI" && !upiTxnId.trim()) {
      alert("Please enter the UPI Transaction ID after making the payment.");
      return;
    }

    setIsProcessing(true);
    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const fullAddress = `${finalAddr.flat?.trim()}, ${finalAddr.area?.trim()}, ${finalAddr.landmark ? `Near ${finalAddr.landmark.trim()}, ` : ''}${finalAddr.city?.trim()} - ${finalAddr.pincode?.trim()}`;
      
      const { error } = await supabase.from('orders').insert([{
        order_number: orderNumber,
        customer_name: `${customerUser.user_metadata?.full_name || customerUser.email.split('@')[0]} | ${customerUser.email}`,
        amount: cartTotal,
        status: 'pending',
        payment_status: paymentMethod === 'COD' ? 'Pending (COD)' : `Paid (UPI Txn: ${upiTxnId.trim()})`,
        city: `${fullAddress} | Phone: ${phone.trim()}`,
        products: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.quantity,
          price: item.offerPrice || item.price,
          unit: item.unit
        })))
      }]);

      if (error) throw error;

      if (addressSelection === "new" && saveNewAddress) {
        await supabase.auth.updateUser({
          data: { address: { flat: address.flat, area: address.area, city: address.city, pincode: address.pincode } }
        });
      }

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
            
            {/* Address and Payment Options inside scrollable area */}
            {cartItems.length > 0 && !orderSuccess && (
              <div className="mt-8 flex flex-col gap-6">
                
                {/* Address Form */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-bold text-on-surface">Delivery Details</label>
                  </div>

                  <div className="flex flex-col gap-2 mb-3">
                    {primaryAddressObj && (
                      <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${addressSelection === 'primary' ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface'}`}>
                        <input type="radio" name="addressSelect" checked={addressSelection === 'primary'} onChange={() => setAddressSelection('primary')} className="mt-1" />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-primary">Primary Delivery Address</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2">{primaryAddressObj.flat}, {primaryAddressObj.area}, {primaryAddressObj.city} - {primaryAddressObj.pincode}</p>
                        </div>
                      </label>
                    )}
                    {shopAddressObj && (
                      <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${addressSelection === 'shop' ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface'}`}>
                        <input type="radio" name="addressSelect" checked={addressSelection === 'shop'} onChange={() => setAddressSelection('shop')} className="mt-1" />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-primary">Shop / Business Address</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2">{shopAddressObj.flat}, {shopAddressObj.area}, {shopAddressObj.city} - {shopAddressObj.pincode}</p>
                        </div>
                      </label>
                    )}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${addressSelection === 'new' ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface'}`}>
                      <input type="radio" name="addressSelect" checked={addressSelection === 'new'} onChange={() => setAddressSelection('new')} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-primary">Use a Different Address</p>
                        <p className="text-xs text-on-surface-variant">Enter a new address below</p>
                      </div>
                    </label>
                  </div>
                  
                  {addressSelection === 'new' && (
                    <div className="flex flex-col gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 animate-fade-in">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-on-surface-variant uppercase">New Address Details</span>
                        <button 
                          onClick={handleGetLocation} 
                          disabled={isLocating}
                          className="text-xs text-[#D4A64A] font-bold flex items-center gap-1 hover:underline transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px]">{isLocating ? 'hourglass_empty' : 'my_location'}</span>
                          {isLocating ? 'Locating...' : 'Use Current Location'}
                        </button>
                      </div>
                      <input 
                        type="text" placeholder="Flat, House no., Building, Apartment *" 
                        value={address.flat} onChange={(e) => setAddress({...address, flat: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-outline-variant bg-white outline-none focus:border-primary text-sm"
                      />
                      <input 
                        type="text" placeholder="Area, Street, Sector, Village *" 
                        value={address.area} onChange={(e) => setAddress({...address, area: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-outline-variant bg-white outline-none focus:border-primary text-sm"
                      />
                      <input 
                        type="text" placeholder="Landmark (Optional)" 
                        value={address.landmark} onChange={(e) => setAddress({...address, landmark: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-outline-variant bg-white outline-none focus:border-primary text-sm"
                      />
                      <div className="flex gap-3">
                        <input 
                          type="text" placeholder="Town/City *" 
                          value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
                          className="w-full p-2.5 rounded-lg border border-outline-variant bg-white outline-none focus:border-primary text-sm"
                        />
                        <input 
                          type="text" placeholder="Pincode *" 
                          value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})}
                          className="w-full p-2.5 rounded-lg border border-outline-variant bg-white outline-none focus:border-primary text-sm"
                        />
                      </div>
                      <label className="flex items-center gap-2 mt-1 cursor-pointer">
                        <input type="checkbox" checked={saveNewAddress} onChange={e => setSaveNewAddress(e.target.checked)} className="rounded text-primary" />
                        <span className="text-xs font-medium text-on-surface-variant">Save as Primary Delivery Address for future</span>
                      </label>
                    </div>
                  )}
                  
                  <input 
                    type="tel" 
                    placeholder="Phone Number *" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary text-sm font-medium mt-2"
                  />
                </div>

                {/* Payment Method */}
                <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant">
                  <label className="text-sm font-bold text-on-surface">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-3 rounded-lg border font-bold text-sm transition-all ${paymentMethod === "COD" ? 'border-[#1F5132] bg-[#1F5132]/5 text-[#1F5132]' : 'border-outline-variant text-gray-500 hover:bg-surface-container'}`}
                    >
                      Cash on Delivery
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("UPI")}
                      className={`p-3 rounded-lg border font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === "UPI" ? 'border-[#1F5132] bg-[#1F5132]/5 text-[#1F5132]' : 'border-outline-variant text-gray-500 hover:bg-surface-container'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                      UPI / QR
                    </button>
                  </div>

                  {paymentMethod === "UPI" && (
                    <div className="mt-2 p-4 bg-white border border-outline-variant rounded-xl flex flex-col items-center text-center animate-fade-in shadow-inner">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Scan to Pay ₹{cartTotal.toFixed(2)}</p>
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 mb-3">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=merchant@upi&pn=Arihant&am=${cartTotal}&cu=INR`)}`} alt="UPI QR Code" className="w-32 h-32" />
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Pay using any UPI app (GPay, PhonePe, Paytm)</p>
                      <input 
                        type="text" 
                        placeholder="Enter UPI Transaction ID (Required) *" 
                        value={upiTxnId}
                        onChange={(e) => setUpiTxnId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary text-sm text-center font-medium"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {cartItems.length > 0 && !orderSuccess && (
            <div className="border-t border-outline-variant p-6 bg-surface-container-low flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium text-lg">Subtotal</span>
                <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || !address.flat.trim() || !address.area.trim() || !address.city.trim() || !address.pincode.trim() || !phone.trim() || (paymentMethod === "UPI" && !upiTxnId.trim())}
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
                <p className="text-center text-xs text-on-surface-variant mt-1">
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
