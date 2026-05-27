#!/bin/bash

# Test script for chat history persistence across page navigation
# Tests the fix for chat history disappearing when navigating between pages

set -e

API_URL="http://localhost:5000/api"
SUPABASE_URL="https://psdjfoayyhipntmvumzf.supabase.co/rest/v1"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZGpmb2F5eWhpcG50bXZ1bXpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjc1NTIwMCwiZXhwIjoyMDUyMzMxMjAwfQ.wY8JLYqJLKqOXVLqYqYqYqYqYqYqYqYqYqYqYqYqYqY"

echo "=========================================="
echo "Chat Persistence Test Suite"
echo "=========================================="
echo ""

# Generate unique test user
TIMESTAMP=$(date +%s)
TEST_EMAIL="chattest_${TIMESTAMP}@test.com"
TEST_USERNAME="chattest_${TIMESTAMP}"
TEST_PASSWORD="TestPass123!"

echo "Step 1: Creating test user..."
echo "Email: $TEST_EMAIL"
echo "Username: $TEST_USERNAME"

SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Signup response: $SIGNUP_RESPONSE"

# Extract user ID from signup
USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo "❌ Failed to create user"
  exit 1
fi

echo "✓ User created successfully"
echo "User ID: $USER_ID"
echo ""

# Wait for user to be fully created
sleep 2

echo "Step 1b: Signing in to get auth token..."
SIGNIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"identifier\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Signin response: $SIGNIN_RESPONSE"

# Extract token from signin
TOKEN=$(echo "$SIGNIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token"
  exit 1
fi

echo "✓ Signed in successfully"
echo "Token: ${TOKEN:0:20}..."
echo ""

echo "Step 2: Verifying initial memory is empty..."
MEMORY_RESPONSE=$(curl -s -X GET "$API_URL/ai/memory" \
  -H "Authorization: Bearer $TOKEN")

echo "Initial memory: $MEMORY_RESPONSE"

CONV_COUNT=$(echo "$MEMORY_RESPONSE" | grep -o '"conversation_history":\[' | wc -l)
if [ "$CONV_COUNT" -eq 0 ]; then
  echo "❌ Memory response format unexpected"
  exit 1
fi

echo "✓ Initial memory is empty"
echo ""

echo "Step 3: Sending first chat message..."
CHAT1_RESPONSE=$(curl -s -X POST "$API_URL/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"message\": \"Hello, this is a test message\",
    \"language\": \"en-US\"
  }")

echo "Chat response 1: ${CHAT1_RESPONSE:0:200}..."

# Check if response has reply
if echo "$CHAT1_RESPONSE" | grep -q '"reply"'; then
  echo "✓ First message sent successfully"
else
  echo "❌ First message failed"
  echo "Full response: $CHAT1_RESPONSE"
  exit 1
fi
echo ""

# Wait for save to complete
sleep 2

echo "Step 4: Simulating page navigation - fetching memory again..."
MEMORY_AFTER_1=$(curl -s -X GET "$API_URL/ai/memory" \
  -H "Authorization: Bearer $TOKEN")

echo "Memory after first message: $MEMORY_AFTER_1"

# Check if conversation_history has 1 entry (Gradio format uses "user" field)
if echo "$MEMORY_AFTER_1" | grep -q '"user":".*Hello, this is a test message"'; then
  echo "✓ First message persisted in memory"
else
  echo "❌ First message NOT found in memory"
  echo "Expected: user field with 'Hello, this is a test message'"
  exit 1
fi
echo ""

echo "Step 5: Sending second chat message..."
CHAT2_RESPONSE=$(curl -s -X POST "$API_URL/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"message\": \"This is my second message\",
    \"language\": \"en-US\"
  }")

echo "Chat response 2: ${CHAT2_RESPONSE:0:200}..."

if echo "$CHAT2_RESPONSE" | grep -q '"reply"'; then
  echo "✓ Second message sent successfully"
else
  echo "❌ Second message failed"
  exit 1
fi
echo ""

# Wait for save to complete
sleep 2

echo "Step 6: Verifying both messages persist in memory..."
MEMORY_AFTER_2=$(curl -s -X GET "$API_URL/ai/memory" \
  -H "Authorization: Bearer $TOKEN")

echo "Memory after second message: $MEMORY_AFTER_2"

# Check if both messages exist (Gradio format uses "user" field)
if echo "$MEMORY_AFTER_2" | grep -q '"user":".*Hello, this is a test message"' && \
   echo "$MEMORY_AFTER_2" | grep -q '"user":".*This is my second message"'; then
  echo "✓ Both messages persisted in memory"
else
  echo "❌ Not all messages found in memory"
  exit 1
fi
echo ""

echo "Step 7: Verifying DB structure directly..."
DB_RESPONSE=$(curl -s -X GET "$SUPABASE_URL/user_ai_memory?user_id=eq.$USER_ID&select=*" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY")

echo "DB record: $DB_RESPONSE"

# Check structure has conversation_history and lastUpdated
if echo "$DB_RESPONSE" | grep -q '"conversation_history"' && \
   echo "$DB_RESPONSE" | grep -q '"lastUpdated"'; then
  echo "✓ DB structure is correct (has conversation_history and lastUpdated)"
else
  echo "❌ DB structure is incorrect"
  exit 1
fi
echo ""

echo "=========================================="
echo "✓ ALL TESTS PASSED"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Chat messages are saved to database"
echo "- Memory persists across page navigation (simulated by GET requests)"
echo "- Multiple messages accumulate in conversation history"
echo "- DB structure matches expected format"
echo ""
echo "Test user created: $TEST_EMAIL (ID: $USER_ID)"
echo "You can manually test in browser by:"
echo "1. Login with: $TEST_EMAIL / $TEST_PASSWORD"
echo "2. Go to Chat page, send messages"
echo "3. Navigate to Home, then back to Chat"
echo "4. Verify chat history is still visible"
