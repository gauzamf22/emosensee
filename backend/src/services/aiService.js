const { Client } = require('@gradio/client');
const { createClient } = require('@supabase/supabase-js');

const GRADIO_SPACE = 'barudakwell/mental-health-ai';
const GRADIO_ENDPOINT = '/api_chat';

const getSupabase = (token) => createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY, 
  {
    global: { headers: { Authorization: `Bearer ${token}` } }
  }
);

/**
 * Get user's AI conversation memory from database
 * Implements 24h lazy clear - returns empty if >24h old
 * @param {string} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} Memory JSON object (conversation_history for Gradio)
 */
const getUserMemory = async (userId, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('user_ai_memory')
    .select('memory_json')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  
  // Return empty memory if no record exists
  if (!data?.memory_json) {
    return [];
  }
  
  const memory = data.memory_json;
  
  // Check if memory has lastUpdated timestamp
  if (!memory.lastUpdated) {
    // Old format without timestamp, treat as expired
    return [];
  }
  
  // Check if memory is older than 24 hours
  const lastUpdated = new Date(memory.lastUpdated);
  const now = new Date();
  const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) {
    // Memory expired, return empty
    return [];
  }
  
  // Return the conversation_history array
  return memory.conversation_history || [];
};

/**
 * Save updated AI conversation memory to database
 * Wraps memory with timestamp for 24h lazy clear
 * @param {string} userId - User ID
 * @param {object} memoryJson - Memory JSON object from Gradio (conversation_history)
 * @param {string} token - Auth token
 * @returns {Promise<object>} Saved memory data
 */
const saveUserMemory = async (userId, memoryJson, token) => {
  const supabase = getSupabase(token);
  
  // Wrap memory with timestamp and conversation_history structure
  const wrappedMemory = {
    conversation_history: memoryJson,
    lastUpdated: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('user_ai_memory')
    .upsert(
      {
        user_id: userId,
        memory_json: wrappedMemory,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Send message to Gradio AI and get response with analytics
 * @param {string} userId - User ID
 * @param {string} message - User message
 * @param {string} token - Auth token
 * @param {string} language - Language code ('id-ID' or 'en-US')
 * @returns {Promise<object>} {reply, analytics, memory}
 */
const sendMessageToAI = async (userId, message, token, language) => {
  try {
    // 1. Get user's conversation memory
    const memory = await getUserMemory(userId, token);
    
    // 2. Prepend language tag to message
    let languageTag = 'EN'; // default
    if (language) {
      const langCode = language.split('-')[0].toUpperCase(); // 'id-ID' → 'ID', 'en-US' → 'EN'
      languageTag = langCode;
    }
    const taggedMessage = `[LANGUAGE: ${languageTag}] ${message}`;
    
    // 3. Connect to Gradio space
    const client = await Client.connect(GRADIO_SPACE);
    
    // 4. Call AI endpoint with tagged message and memory
    console.log('[AI Service] Calling Gradio with memory:', JSON.stringify(memory));
    const result = await client.predict(GRADIO_ENDPOINT, {
      text: taggedMessage,
      memory_json: JSON.stringify(memory)
    });
    console.log('[AI Service] Gradio response:', JSON.stringify(result));
    
    // 5. Parse response
    // Gradio returns result.data array, first element is the JSON string
    const responseData = result.data && result.data[0];
    
    if (!responseData) {
      throw new Error('Respons AI kosong atau tidak valid');
    }
    
    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = typeof responseData === 'string' 
        ? JSON.parse(responseData) 
        : responseData;
    } catch (parseError) {
      throw new Error('Format respons AI tidak valid');
    }
    
    const { counselor_reply, analytics, updated_memory } = parsedResponse;
    
    if (!counselor_reply) {
      throw new Error('Respons AI tidak lengkap');
    }
    
    // 6. Save conversation memory using Gradio's updated_memory structure
    // If Gradio provides updated_memory, use it; otherwise construct fallback
    let memoryToSave = updated_memory;
    
    if (!memoryToSave) {
      // Fallback: construct memory in Gradio's expected format
      // memory is either [] (empty) or {summary, history, emotion_stats, session_count} (existing)
      const existingHistory = Array.isArray(memory) ? [] : (memory.history || []);
      
      memoryToSave = {
        summary: Array.isArray(memory) ? "" : (memory.summary || ""),
        history: [
          ...existingHistory,
          {
            timestamp: new Date().toISOString(),
            user: taggedMessage,
            ai: counselor_reply,
            emotions: analytics?.emotions || [],
            severity: analytics?.severity || "low"
          }
        ],
        emotion_stats: Array.isArray(memory) ? {} : (memory.emotion_stats || {}),
        session_count: Array.isArray(memory) ? 1 : ((memory.session_count || 0) + 1)
      };
    }
    
    // Always save to database
    try {
      await saveUserMemory(userId, memoryToSave, token);
    } catch (saveError) {
      // Log error but don't fail the request - user still gets AI response
      console.error('Failed to save conversation memory:', saveError);
    }
    
    // 7. Return structured response
    return {
      reply: counselor_reply,
      analytics: analytics || {
        emotions: [],
        keywords: [],
        severity: 'low',
        severity_score: 1
      },
      memory: memoryToSave
    };
    
  } catch (error) {
    // Log full error details for debugging
    console.error('[AI Service] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific error types
    if (error.message.includes('connect') || error.message.includes('timeout')) {
      throw new Error('Layanan AI sedang sibuk, silakan coba lagi dalam beberapa saat');
    }
    
    if (error.message.includes('Respons') || error.message.includes('Format')) {
      throw error; // Already has Indonesian message
    }
    
    // Generic error
    throw new Error(`Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}`);
  }
};

module.exports = {
  getSupabase,
  getUserMemory,
  saveUserMemory,
  sendMessageToAI
};
