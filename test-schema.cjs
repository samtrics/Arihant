const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://dwoopfogqrrsshoxpdhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b29wZm9ncXJyc3Nob3hwZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTA1NzIsImV4cCI6MjA5NTAyNjU3Mn0.Q3SNyLExoJnLNPEtD4ot1OzRbVbq2OaSclkyU2Axl2s');

async function testInsert() {
  let payload = {
    order_number: 'B2B-1234'
  };
  
  for (let i = 0; i < 10; i++) {
    const { error } = await supabase.from('orders').insert([payload]);
    if (!error) {
      console.log('Success!', payload);
      break;
    }
    console.log('Error:', error.message);
    const match = error.message.match(/null value in column "([^"]+)"/);
    if (match) {
      const col = match[1];
      if (col === 'total_amount' || col === 'amount') payload[col] = 100;
      else if (col === 'user_id' || col === 'customer_id') payload[col] = '123e4567-e89b-12d3-a456-426614174000';
      else if (col === 'status') payload[col] = 'pending';
      else payload[col] = 'test';
    } else {
      break;
    }
  }
}
testInsert();
