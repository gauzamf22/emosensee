require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  try {
    console.log('Creating user_ai_memory table...');
    
    const sql = fs.readFileSync('./migrations/001_create_user_ai_memory.sql', 'utf8');
    
    // Execute SQL using service role
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Try alternative: execute statements one by one
      console.log('Trying direct table creation...');
      
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_ai_memory (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            memory_json JSONB NOT NULL DEFAULT '{}',
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_user_ai_memory_updated ON user_ai_memory(updated_at);
        `
      });
      
      if (createError) {
        throw createError;
      }
    }
    
    // Verify table exists
    const { data: testData, error: testError } = await supabase
      .from('user_ai_memory')
      .select('*')
      .limit(1);
    
    if (testError) {
      throw testError;
    }
    
    console.log('✓ Table user_ai_memory created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
