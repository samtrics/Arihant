import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- TIER 1: CLIENT-SIDE API THROTTLING ---
// Prevents the browser from spamming Supabase (e.g. fast double clicks or script loops)
const REQUEST_WINDOW_MS = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests per 10 seconds to allow for page load fetches

let requestTimestamps = [];

const throttledFetch = async (...args) => {
  const now = Date.now();
  // Remove timestamps older than our window
  requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < REQUEST_WINDOW_MS);
  
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(`[Rate Limiting] Blocked request to Supabase. Exceeded ${MAX_REQUESTS_PER_WINDOW} reqs per ${REQUEST_WINDOW_MS/1000}s.`);
    
    // We throw an Error so the frontend components' try/catch blocks handle it gracefully (e.g. showing an alert)
    return Promise.reject(new Error("Too many requests. Please wait a moment and try again."));
  }

  requestTimestamps.push(now);
  return fetch(...args);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: throttledFetch
  }
});
