require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const testEmail = `test_http_${timestamp}@example.com`;
const testPassword = `testpass${timestamp}`;

async function testHTTPEndpoint() {
  try {
    console.log('=== Testing HTTP Endpoint /api/ai/chat ===\n');
    
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
    console.log(`✓ User created: ${testEmail}\n`);
    
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
    console.log(`✓ Signed in, token: ${token.substring(0, 20)}...\n`);
    
    // 3. Test AI Chat endpoint (first message)
    console.log('3. Testing POST /api/ai/chat (first message)...');
    const chatRes1 = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'Halo, saya merasa stres dengan pekerjaan'
      })
    });
    
    const chatData1 = await chatRes1.json();
    if (!chatRes1.ok) {
      throw new Error(`AI chat failed: ${JSON.stringify(chatData1)}`);
    }
    
    console.log(`✓ Response received`);
    console.log(`  Reply: ${chatData1.data.reply.substring(0, 100)}...`);
    console.log(`  Analytics:`, JSON.stringify(chatData1.data.analytics, null, 2));
    console.log();
    
    // 4. Test second message (with memory context)
    console.log('4. Testing POST /api/ai/chat (second message)...');
    const chatRes2 = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'Apa yang harus saya lakukan?'
      })
    });
    
    const chatData2 = await chatRes2.json();
    if (!chatRes2.ok) {
      throw new Error(`AI chat 2 failed: ${JSON.stringify(chatData2)}`);
    }
    
    console.log(`✓ Response received (with context)`);
    console.log(`  Reply: ${chatData2.data.reply.substring(0, 100)}...`);
    console.log();
    
    // 5. Test error cases
    console.log('5. Testing error cases...');
    
    // 5a. No token
    const noTokenRes = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' })
    });
    console.log(`  No token: ${noTokenRes.status} ${noTokenRes.ok ? '❌ FAIL' : '✓ OK'}`);
    
    // 5b. Empty message
    const emptyMsgRes = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: '' })
    });
    const emptyMsgData = await emptyMsgRes.json();
    console.log(`  Empty message: ${emptyMsgRes.status} - ${emptyMsgData.message}`);
    console.log();
    
    console.log('=== All HTTP Tests Passed ✓ ===');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testHTTPEndpoint();
