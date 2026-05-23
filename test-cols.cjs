const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dwoopfogqrrsshoxpdhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b29wZm9ncXJyc3Nob3hwZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTA1NzIsImV4cCI6MjA5NTAyNjU3Mn0.Q3SNyLExoJnLNPEtD4ot1OzRbVbq2OaSclkyU2Axl2s');

async function checkColumns() {
  const testPayload = {
    order_number: 'B2B-9999',
    customer_name: 'test',
    amount: 100,
    products: JSON.stringify([{name: 'test', qty: 1}]),
    status: 'pending',
    payment_status: 'pending',

  };
  
  const { data, error } = await supabase.from('orders').insert([testPayload]).select();
  console.log('Result:', data, error);
}
checkColumns();
