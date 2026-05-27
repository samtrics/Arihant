import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Analytics } from "@vercel/analytics/react"
import CryptoJS from 'crypto-js'

const SECRET_KEY = "arihant_secure_key_2026";
const originalSetItem = localStorage.setItem;
const originalGetItem = localStorage.getItem;

const shouldEncrypt = (key) => {
  const k = key.toLowerCase();
  return k.includes('arihant') || k.includes('admin') || k.includes('distributor') || k.includes('order') || k.includes('product') || k.includes('cart') || k.includes('customer');
};

localStorage.setItem = function(key, value) {
  if (shouldEncrypt(key)) {
    try {
      const ciphertext = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      originalSetItem.call(localStorage, key, ciphertext);
    } catch (e) {
      originalSetItem.call(localStorage, key, value);
    }
  } else {
    originalSetItem.call(localStorage, key, value);
  }
};

localStorage.getItem = function(key) {
  const value = originalGetItem.call(localStorage, key);
  if (!value) return value;
  
  if (shouldEncrypt(key)) {
    try {
      const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted) return decrypted;
      return value; // fallback for old plaintext data
    } catch (e) {
      return value; // fallback
    }
  }
  return value;
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Analytics />
    </CartProvider>
  </StrictMode>,
)
