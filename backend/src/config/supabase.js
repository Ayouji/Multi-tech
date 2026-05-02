require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_PUBLISHABLE_KEY sont requises dans le .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
