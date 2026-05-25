const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dwoopfogqrrsshoxpdhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b29wZm9ncXJyc3Nob3hwZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTA1NzIsImV4cCI6MjA5NTAyNjU3Mn0.Q3SNyLExoJnLNPEtD4ot1OzRbVbq2OaSclkyU2Axl2s');

async function checkCols() {
  const payload = {
    order_number: 'ORD-TEST-COLS',
    customer_name: 'Test',
    amount: 100,
    products: [],
    city: 'Surat',
    address: '123 Test St',
    phone: '1234567890'
  };
  const { error } = await supabase.from('orders').insert([payload]);
  console.log("Error:", error);
}

checkCols();
