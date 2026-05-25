const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dwoopfogqrrsshoxpdhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b29wZm9ncXJyc3Nob3hwZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTA1NzIsImV4cCI6MjA5NTAyNjU3Mn0.Q3SNyLExoJnLNPEtD4ot1OzRbVbq2OaSclkyU2Axl2s');

async function testInsert() {
  const payload = {
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    amount: 100,
    status: 'pending',
    products: JSON.stringify([{ id: 1, name: 'Test', quantity: 1, price: 100, unit: '1kg' }])
  };
  
  const { error, data } = await supabase.from('orders').insert([payload]).select();
  if (error) {
    console.error('Error with stringified products:', error);
  } else {
    console.log('Success with stringified products:', data);
  }

  const payload2 = {
    order_number: `ORD-${(Date.now() + 1).toString().slice(-6)}`,
    customer_name: 'Test User 2',
    customer_email: 'test2@example.com',
    amount: 200,
    status: 'pending',
    products: [{ id: 1, name: 'Test', quantity: 1, price: 100, unit: '1kg' }]
  };
  
  const { error: err2, data: data2 } = await supabase.from('orders').insert([payload2]).select();
  if (err2) {
    console.error('Error with object products:', err2);
  } else {
    console.log('Success with object products:', data2);
  }
}

testInsert();
