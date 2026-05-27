# Manual Test Checklist - AI Chat & Voice

## Setup Status
✅ Backend: http://localhost:5000 (screen session: backend)
✅ Frontend: http://localhost:5174 (screen session: frontend)
✅ AI Service: Gradio API tested & working
✅ Memory: user_ai_memory table + RLS policies active

## Test User Credentials
- Email: `testuser_${Date.now()}@example.com` (create new)
- Password: `Test123!@#`

---

## Test 1: Authentication Flow
1. Open http://localhost:5174
2. Click "Sign Up" / "Daftar"
3. Fill form with test credentials
4. Verify redirect to dashboard/main app
5. Check browser console for errors

**Expected**: Successful signup → logged in → no console errors

---

## Test 2: AI Chat - Text Input
1. Navigate to AI Chat section
2. Type message: "Saya merasa cemas hari ini"
3. Click Send button
4. Wait for AI response (may take 10-30s for Gradio API)

**Expected**:
- Message appears in chat history
- AI counselor responds in Indonesian
- No error toasts
- Response includes empathy + guidance

**Check Console**: Look for successful POST to `/api/ai/chat`

---

## Test 3: AI Chat - Memory Persistence
1. Send 2nd message: "Apa yang bisa saya lakukan?"
2. Check if AI references previous conversation
3. Logout → Login again
4. Send new message
5. Check if AI remembers past sessions

**Expected**:
- AI maintains context within session
- AI remembers user across sessions (session_count increments)

**Verify in Supabase**:
- Go to Table Editor → user_ai_memory
- Check your user_id row
- Verify `history` array has messages
- Verify `session_count` increments

---

## Test 4: Voice Recording - Basic Flow
1. Click microphone button in chat
2. Browser prompts for mic permission → Allow
3. Speak in Indonesian: "Halo, saya ingin curhat"
4. Click checkmark (send) button
5. Wait for transcription + AI response

**Expected**:
- Recording indicator shows (red dot/animation)
- Transcript appears in input field
- Message sent to AI
- AI responds to voice message

**Check Console**: Look for speech recognition events

---

## Test 5: Voice Recording - Cancel
1. Click microphone button
2. Start speaking
3. Click X (cancel) button before sending

**Expected**:
- Recording stops
- Transcript discarded
- No message sent to AI

---

## Test 6: Voice Recording - Error Handling
1. Click microphone in browser without mic support (or deny permission)

**Expected**:
- Toast notification: "Browser Anda tidak mendukung voice recording" OR "Izin mikrofon ditolak"
- Microphone button disabled/grayed out

---

## Test 7: Voice Recording - Language Switch
1. Start recording
2. Speak in English: "I feel anxious today"
3. Send message
4. Check if AI responds appropriately

**Expected**:
- Transcript captures English text
- AI responds (may be in Indonesian or English depending on model)

---

## Test 8: Error Scenarios
### 8a. Network Error
1. Stop backend: `screen -S backend -X quit`
2. Try sending chat message

**Expected**: Toast error "Layanan AI sedang sibuk" or connection error

### 8b. Empty Message
1. Click Send with empty input

**Expected**: Validation prevents sending OR backend returns "Pesan tidak boleh kosong"

### 8c. Gradio API Timeout
1. Send message
2. If Gradio is slow/down, wait 60s

**Expected**: Timeout error with user-friendly message

---

## Debugging Commands

### Check Backend Logs
```bash
screen -r backend
# Press Ctrl+A then D to detach
```

### Check Frontend Logs
```bash
screen -r frontend
# Press Ctrl+A then D to detach
```

### Check Backend Health
```bash
curl http://localhost:5000/api/auth/signup -X POST \
  -H "Content-Type: application/json" \
  -d '{"test":"test"}'
# Should return: {"success":false,"message":"Semua field wajib diisi"}
```

### Check AI Memory in DB
```sql
-- Run in Supabase SQL Editor
SELECT user_id, 
       (memory_data->>'session_count')::int as sessions,
       jsonb_array_length(memory_data->'history') as message_count,
       updated_at
FROM user_ai_memory
ORDER BY updated_at DESC
LIMIT 5;
```

### Restart Services
```bash
# Restart backend
screen -S backend -X quit
cd /home/ubuntu/emosensee/backend && screen -dmS backend node server.js

# Restart frontend
screen -S frontend -X quit
cd /home/ubuntu/emosensee && screen -dmS frontend npm run dev
```

---

## Known Issues / Limitations
- Gradio API can be slow (10-30s response time)
- Voice recognition requires Chrome/Edge (WebKit Speech API)
- Voice recognition needs internet (browser API uses cloud)
- Memory sliding window keeps last 10 messages (older messages dropped)
- RLS policies require valid Supabase auth token

---

## Success Criteria
✅ User can signup/login
✅ Text chat sends message → AI responds
✅ Voice recording captures speech → transcribes → sends to AI
✅ Memory persists across sessions (check DB)
✅ Error messages in Indonesian
✅ No console errors during normal flow
