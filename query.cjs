require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('products').select('*').ilike('name', '%daliya%').then(r => console.log(JSON.stringify(r.data, null, 2)));
