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
 * @param {string} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} Memory JSON object
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
  return data?.memory_json || {};
};

/**
 * Save updated AI conversation memory to database
 * @param {string} userId - User ID
 * @param {object} memoryJson - Memory JSON object
 * @param {string} token - Auth token
 * @returns {Promise<object>} Saved memory data
 */
const saveUserMemory = async (userId, memoryJson, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('user_ai_memory')
    .upsert(
      {
        user_id: userId,
        memory_json: memoryJson,
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
    const result = await client.predict(GRADIO_ENDPOINT, {
      text: taggedMessage,
      memory_json: JSON.stringify(memory)
    });
    
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
    
    // 6. Save updated memory to database
    if (updated_memory) {
      await saveUserMemory(userId, updated_memory, token);
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
      memory: updated_memory || memory
    };
    
  } catch (error) {
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
  getUserMemory,
  saveUserMemory,
  sendMessageToAI
};
