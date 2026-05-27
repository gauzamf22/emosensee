#!/bin/bash
set -e

API_BASE="http://localhost:5000/api"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123!"

echo "========================================="
echo "Testing All 4 Bug Fixes"
echo "========================================="
echo ""

# Test 1: Sign up test user
echo "📝 Creating test user..."
TEST_USERNAME="testuser_$(date +%s)"
SIGNUP_RESPONSE=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}")

echo "$SIGNUP_RESPONSE" | jq '.' 2>/dev/null || echo "$SIGNUP_RESPONSE"

# Signup doesn't return token, so login to get it
echo ""
echo "🔑 Logging in to get auth token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // .access_token // empty' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Could not obtain auth token. Exiting."
  exit 1
fi

echo "✅ Auth token obtained: ${TOKEN:0:20}..."
echo ""

# Test Bug #1: Journal creation (desc typo fix)
echo "========================================="
echo "🐛 BUG #1: Testing Journal Creation"
echo "Fix: Journaling.tsx:65 description → desc"
echo "========================================="

JOURNAL_RESPONSE=$(curl -s -X POST "$API_BASE/journals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Test Journal Entry\",\"content\":\"This is a test journal entry to verify the desc parameter fix.\"}")

echo "$JOURNAL_RESPONSE" | jq '.' 2>/dev/null || echo "$JOURNAL_RESPONSE"

if echo "$JOURNAL_RESPONSE" | grep -q "error\|Error"; then
  echo "❌ BUG #1: Journal creation FAILED"
else
  echo "✅ BUG #1: Journal creation SUCCESS"
fi
echo ""

# Test Bug #2 & #3: AI Chat (req.supabase fix + memory persistence)
echo "========================================="
echo "🐛 BUG #2: Testing AI Chat"
echo "Fix: aiController.js:15 req.supabase → aiService.getSupabase(token)"
echo "========================================="

CHAT_RESPONSE=$(curl -s -X POST "$API_BASE/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"message\":\"Hello, I'm feeling anxious today.\"}")

echo "$CHAT_RESPONSE" | jq '.' 2>/dev/null || echo "$CHAT_RESPONSE"

if echo "$CHAT_RESPONSE" | grep -q "error\|Error\|undefined"; then
  echo "❌ BUG #2: AI Chat FAILED"
else
  echo "✅ BUG #2: AI Chat SUCCESS"
fi
echo ""

# Test Bug #3: Memory persistence
echo "========================================="
echo "🐛 BUG #3: Testing Chat Memory Persistence"
echo "Fix: Same as Bug #2 (req.supabase fix)"
echo "========================================="

sleep 2

MEMORY_RESPONSE=$(curl -s -X GET "$API_BASE/ai/memory" \
  -H "Authorization: Bearer $TOKEN")

echo "$MEMORY_RESPONSE" | jq '.' 2>/dev/null || echo "$MEMORY_RESPONSE"

if echo "$MEMORY_RESPONSE" | grep -q "conversation_history"; then
  echo "✅ BUG #3: Memory persistence SUCCESS"
else
  echo "❌ BUG #3: Memory persistence FAILED"
fi
echo ""

# Test Bug #4: Daily insights table
echo "========================================="
echo "🐛 BUG #4: Testing Daily Insights"
echo "Fix: Migration 002_create_daily_insights.sql executed"
echo "========================================="

INSIGHTS_RESPONSE=$(curl -s -X GET "$API_BASE/insights/daily" \
  -H "Authorization: Bearer $TOKEN")

echo "$INSIGHTS_RESPONSE" | jq '.' 2>/dev/null || echo "$INSIGHTS_RESPONSE"

if echo "$INSIGHTS_RESPONSE" | grep -q "relation.*does not exist\|table.*not found"; then
  echo "❌ BUG #4: Daily insights table FAILED"
else
  echo "✅ BUG #4: Daily insights table SUCCESS"
fi
echo ""

echo "========================================="
echo "✅ All tests completed!"
echo "========================================="
