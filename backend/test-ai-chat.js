require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BASE_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const testEmail = `test_ai_${timestamp}@example.com`;
const testPassword = `testpass${timestamp}`;

async function test() {
  try {
    console.log('=== AI Chat Integration Test ===\n');
    
    // 1. Signup
    console.log('1. Signing up test user...');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        username: `testuser${timestamp}`
      })
    });
    
    const signupData = await signupRes.json();
    if (!signupRes.ok) {
      throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
    }
    console.log(`✓ User created: ${testEmail}`);
    console.log(`  User ID: ${signupData.data.user.id}\n`);
    
    // 2. Signin
    console.log('2. Signing in...');
    const signinRes = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const signinData = await signinRes.json();
    if (!signinRes.ok) {
      throw new Error(`Signin failed: ${JSON.stringify(signinData)}`);
    }
    
    const token = signinData.data.session.access_token;
    const userId = signinData.data.user.id;
    console.log(`✓ Signed in successfully`);
    console.log(`  Token: ${token.substring(0, 20)}...\n`);
    
    // 3. Test AI Chat (first message)
    console.log('3. Testing AI chat (first message)...');
    const chatRes1 = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'Halo, saya merasa cemas akhir-akhir ini'
      })
    });
    
    const chatData1 = await chatRes1.json();
    if (!chatRes1.ok) {
      throw new Error(`AI chat failed: ${JSON.stringify(chatData1)}`);
    }
    
    console.log(`✓ AI Response received`);
    console.log(`  Reply: ${chatData1.data.reply.substring(0, 100)}...`);
    console.log(`  Analytics:`, JSON.stringify(chatData1.data.analytics, null, 2));
    console.log();
    
    // 4. Verify memory in DB
    console.log('4. Verifying memory in database...');
    const { data: memoryData, error: memoryError } = await supabase
      .from('user_ai_memory')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (memoryError) {
      throw new Error(`Memory fetch failed: ${memoryError.message}`);
    }
    
    console.log(`✓ Memory found in database`);
    console.log(`  Session count: ${memoryData.memory_json.session_count || 0}`);
    console.log(`  History entries: ${memoryData.memory_json.history?.length || 0}`);
    console.log();
    
    // 5. Test AI Chat (second message - with existing memory)
    console.log('5. Testing AI chat (second message with memory)...');
    const chatRes2 = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'Bagaimana cara mengatasinya?'
      })
    });
    
    const chatData2 = await chatRes2.json();
    if (!chatRes2.ok) {
      throw new Error(`AI chat 2 failed: ${JSON.stringify(chatData2)}`);
    }
    
    console.log(`✓ AI Response received (with context)`);
    console.log(`  Reply: ${chatData2.data.reply.substring(0, 100)}...`);
    console.log();
    
    // 6. Verify updated memory
    console.log('6. Verifying updated memory...');
    const { data: memoryData2, error: memoryError2 } = await supabase
      .from('user_ai_memory')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (memoryError2) {
      throw new Error(`Memory fetch 2 failed: ${memoryError2.message}`);
    }
    
    console.log(`✓ Memory updated`);
    console.log(`  Session count: ${memoryData2.memory_json.session_count || 0}`);
    console.log(`  History entries: ${memoryData2.memory_json.history?.length || 0}`);
    console.log();
    
    console.log('=== All Tests Passed ✓ ===');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
