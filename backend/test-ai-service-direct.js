require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const aiService = require('./src/services/aiService');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testAIService() {
  try {
    console.log('=== Testing AI Service Directly ===\n');
    
    // Create test user
    const timestamp = Date.now();
    const testEmail = `test_${timestamp}@example.com`;
    const testPassword = 'testpass123';
    
    console.log('1. Creating test user...');
    const { data: signupData, error: signupError } = await supabaseAnon.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (signupError) throw signupError;
    
    // Sign in to get session token
    const { data: signinData, error: signinError } = await supabaseAnon.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signinError) throw signinError;
    
    const userId = signinData.user.id;
    const token = signinData.session.access_token;
    console.log(`✓ User created & signed in: ${userId}\n`);
    
    // Test 1: First message (no memory)
    console.log('2. Testing first AI chat (no memory)...');
    const result1 = await aiService.sendMessageToAI(userId, 'Halo, saya merasa cemas', token);
    console.log(`✓ Reply: ${result1.reply.substring(0, 80)}...`);
    console.log(`  Analytics:`, JSON.stringify(result1.analytics, null, 2));
    console.log();
    
    // Test 2: Second message (with memory)
    console.log('3. Testing second AI chat (with memory)...');
    const result2 = await aiService.sendMessageToAI(userId, 'Bagaimana cara mengatasinya?', token);
    console.log(`✓ Reply: ${result2.reply.substring(0, 80)}...`);
    console.log();
    
    // Verify memory
    console.log('4. Verifying memory in DB...');
    const { data: memoryData, error: memError } = await supabaseAdmin
      .from('user_ai_memory')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (memError) throw memError;
    console.log(`✓ Memory found`);
    console.log(`  Session count: ${memoryData.memory_json.session_count}`);
    console.log(`  History entries: ${memoryData.memory_json.history?.length || 0}`);
    console.log();
    
    console.log('=== All Tests Passed ✓ ===');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testAIService();
