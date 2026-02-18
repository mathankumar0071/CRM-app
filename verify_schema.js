
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function verifySchema() {
    console.log("Verifying 'leads' table schema...");

    // Attempt to select deal_value from a lead
    const { data, error } = await supabase.from('leads').select('deal_value').limit(1);

    if (error) {
        console.error("❌ Error accessing 'deal_value':", error.message);
        if (error.message.includes('does not exist') || error.code === 'PGRST301') {
            console.log("⚠️ It seems the 'deal_value' column is MISSING.");
            console.log("👉 Please run the 'add_deal_value.sql' script in your Supabase SQL Editor.");
        }
    } else {
        console.log("✅ 'deal_value' column exists and is accessible.");
    }

    // Also try to update a dummy lead to check permissions
    // (Skipping actual update to avoid messing data, just schema check is key)
}

verifySchema();
