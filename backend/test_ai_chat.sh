#!/bin/bash

# Start backend
cd /home/ubuntu/emosensee/backend
node server.js &
SERVER_PID=$!
sleep 2

echo "=== Testing AI Chat Integration ==="

# Generate unique credentials
TIMESTAMP=$(date +%s)
EMAIL="test_ai_${TIMESTAMP}@example.com"
USERNAME="testuser${TIMESTAMP}"
PASSWORD="test123456"

echo -e "\n1. Registering user: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"

echo -e "\n2. Logging in with: $EMAIL"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "\n❌ Failed to get auth token"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo -e "\n✓ Got auth token: ${TOKEN:0:20}..."

echo -e "\n3. Testing AI chat endpoint"
CHAT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"Halo, saya merasa cemas akhir-akhir ini"}')

echo "$CHAT_RESPONSE" | jq '.' 2>/dev/null || echo "$CHAT_RESPONSE"

echo -e "\n=== Test Complete ==="

# Cleanup
kill $SERVER_PID 2>/dev/null
