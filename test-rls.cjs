const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dwoopfogqrrsshoxpdhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b29wZm9ncXJyc3Nob3hwZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTA1NzIsImV4cCI6MjA5NTAyNjU3Mn0.Q3SNyLExoJnLNPEtD4ot1OzRbVbq2OaSclkyU2Axl2s');

async function run() {
  // Try to create a dummy user or sign in
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.log("Auth error:", authErr.message);
    // Let's create the user
    await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123'
    });
    // Try again
    const { data: a2 } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    if (a2) authData.user = a2.user;
  }
  
  if (!authData?.user) {
    console.log("Could not auth");
    return;
  }
  
  console.log("User ID:", authData.user.id);
  
  const payload = {
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    customer_name: 'Test',
    amount: 100,
    products: JSON.stringify([]),
    user_id: authData.user.id // Trying user_id!
  };
  
  const { error, data } = await supabase.from('orders').insert([payload]).select();
  console.log("Insert result (user_id):", error || data);
  
  const payload2 = {
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    customer_name: 'Test',
    amount: 100,
    products: JSON.stringify([]),
    customer_id: authData.user.id // Trying customer_id!
  };
  
  const { error: e2, data: d2 } = await supabase.from('orders').insert([payload2]).select();
  console.log("Insert result (customer_id):", e2 || d2);
}

run();
