# Test Credentials - AI Chat

## Quick Test Instructions

### 1. Open Browser
```
http://localhost:5174
```

### 2. Login dengan Test User
**Email:** `testui_1779821707670@example.com`  
**Password:** `Test123!@#`

### 3. Navigate ke AI Chat
- Klik menu "AI Chat" atau "Mosens"

### 4. Test Text Chat
Ketik: `Halo, saya merasa cemas hari ini`

**Expected:**
- AI responds dalam 10-30 detik
- Response: empati + guidance dalam Bahasa Indonesia
- Jika error, sekarang akan tampil pesan spesifik:
  - "Anda harus login terlebih dahulu" → logout & login lagi
  - "HTTP 401" → token expired, refresh page
  - "Layanan AI sedang sibuk" → Gradio API down

### 5. Test Voice Recording
- Klik icon microphone
- Browser minta izin mic → **Allow**
- Bicara: "Saya butuh bantuan"
- Klik checkmark (✓) untuk send

**Expected:**
- Transcript muncul di input field
- AI responds ke voice message

---

## Debugging

### Check Browser Console (F12)
```javascript
// Should see:
POST http://localhost:5000/api/ai/chat
Status: 200 OK

// If error:
"Chat error: Anda harus login terlebih dahulu"  // No session
"Chat error: HTTP 401: Unauthorized"            // Token invalid
```

### Check Backend Logs
```bash
screen -r backend
# Look for:
# POST /api/ai/chat 200 7234.567 ms - 443  ← Success
# POST /api/ai/chat 401 8.123 ms - 67      ← Auth error
```

### Check Session in Browser DevTools
```javascript
// In browser console:
localStorage.getItem('supabase.auth.token')
// Should return JSON with access_token
```

### Manual Token Test (if needed)
```bash
# Get fresh token
TOKEN="eyJhbGciOiJFUzI1NiIsImtpZCI6IjNhNWE1MDdkLWJjM2YtNDhiOS05Mzk5LWRjOTJjODkyMTgwYSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BzZGpmb2F5eWhpcG50bXZ1bXpmLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmNmRkNjk2Mi1mNzM5LTRkOGEtOWIxNC0wODY4OWRkYzIzMGIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc5ODI1MzA4LCJpYXQiOjE3Nzk4MjE3MDgsImVtYWlsIjoidGVzdHVpXzE3Nzk4MjE3MDc2NzBAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3OTgyMTcwOH1dLCJzZXNzaW9uX2lkIjoiZDljZTRiNGEtMTQxMS00YjRlLTljMWYtOGM3YTc0MWEwY2IyIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.3ooCM7CX7Y9BD6JnAxBduwOdZL-zeRM6GRtwQD8EGf1MdnnuP9nfWOMe3AhQnIfg6COcaQzdpZcM9QFNURefgw"

curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"test"}' \
  --max-time 60
```

---

## Common Issues

### "Maaf, terjadi kesalahan" (Generic Error)
**Cause:** Old frontend code (before error handling update)  
**Fix:** Hard refresh browser (Ctrl+Shift+R) or clear cache

### "Anda harus login terlebih dahulu"
**Cause:** No session token  
**Fix:** Logout → Login lagi dengan credentials di atas

### Voice recording tidak jalan
**Cause:** Browser tidak support atau mic permission denied  
**Fix:** 
- Gunakan Chrome/Edge (bukan Firefox)
- Check mic permission di browser settings
- Reload page setelah allow permission

### AI response lambat (>30 detik)
**Cause:** Gradio API cold start atau overloaded  
**Fix:** Normal behavior, tunggu saja. Gradio free tier bisa lambat.

---

## Success Indicators

✅ Login berhasil → redirect ke dashboard  
✅ Text chat → AI responds dalam 10-30s  
✅ Voice recording → transcript muncul → AI responds  
✅ Memory persists → check Supabase table `user_ai_memory`  
✅ No console errors (kecuali warnings biasa)
