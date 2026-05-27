const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Hardcoded credentials from frontend config
const supabaseUrl = 'https://psdjfoayyhipntmvumzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZGpmb2F5eWhpcG50bXZ1bXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1OTE5MjksImV4cCI6MjA5NDE2NzkyOX0.F8ZWU0BMU9_w3W1MJaJgxQICjFp201v4zIlbvjFE3ps';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    console.log('🔄 Running migration: create user_ai_memory table');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'migrations', '001_create_user_ai_memory.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 SQL to execute:');
    console.log(sql);
    console.log('\n⚠️  Note: Supabase JS client cannot execute DDL directly.');
    console.log('Please run this SQL manually in Supabase Dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/project/psdjfoayyhipntmvumzf/editor');
    console.log('2. Click "SQL Editor"');
    console.log('3. Paste the SQL above');
    console.log('4. Click "Run"');
    console.log('\nOr use Supabase CLI: supabase db push');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

runMigration();
