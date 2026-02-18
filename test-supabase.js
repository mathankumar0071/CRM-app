
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env manuanlly since we are running with node
const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing keys in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log("Testing Supabase Connection...");
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Connection Failed or Table Missing:", error.message);
        console.log("Did you run the SQL schema script?");
    } else {
        console.log("Connection Successful! Profiles table accessible.");
    }
}

testConnection();
