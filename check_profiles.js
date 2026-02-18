
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfile() {
    console.log("Checking profiles...");
    const { data: profiles, error } = await supabase.from('profiles').select('*');

    if (error) {
        console.error("Error fetching profiles:", error);
    } else {
        console.log(`Found ${profiles.length} profiles.`);
        profiles.forEach(p => console.log(`- ${p.email} (${p.name})`));

        if (profiles.length === 0) {
            console.log("WARNING: No profiles found. If you are logged in, this will cause issues.");
        }
    }
}

checkProfile();
