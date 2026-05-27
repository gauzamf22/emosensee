require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  try {
    console.log('Checking if user_ai_memory table exists...');
    
    const { data, error } = await supabase
      .from('user_ai_memory')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('\n❌ Table does not exist yet.');
        console.log('\n📋 Run this SQL in Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/psdjfoayyhipntmvumzf/sql/new\n');
        console.log('CREATE TABLE IF NOT EXISTS user_ai_memory (');
        console.log('  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,');
        console.log('  memory_json JSONB NOT NULL DEFAULT \'{}\',');
        console.log('  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()');
        console.log(');\n');
        console.log('CREATE INDEX IF NOT EXISTS idx_user_ai_memory_updated ON user_ai_memory(updated_at);');
        process.exit(1);
      }
      throw error;
    }
    
    console.log('✓ Table user_ai_memory exists!');
    console.log(`  Rows: ${data.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
