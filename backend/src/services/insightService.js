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
 * Get today's journals for user
 */
const getTodayJournals = async (userId, token) => {
  const supabase = getSupabase(token);
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('journals')
    .select('title, description, created_at')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

/**
 * Get chat messages from user_ai_memory
 */
const getChatMessages = async (userId, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('user_ai_memory')
    .select('memory_json, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  
  // Check if memory is older than 24h
  if (data?.updated_at) {
    const updatedAt = new Date(data.updated_at);
    const now = new Date();
    const hoursDiff = (now - updatedAt) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      // Clear old memory
      await supabase
        .from('user_ai_memory')
        .update({ memory_json: {}, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      return {};
    }
  }
  
  return data?.memory_json || {};
};

/**
 * Generate personalized insight using Gradio AI
 */
const generateInsight = async (userId, token, language = 'id-ID') => {
  try {
    // 1. Fetch today's data
    const [journals, chatMemory] = await Promise.all([
      getTodayJournals(userId, token),
      getChatMessages(userId, token)
    ]);
    
    // If no activity today, return null (no insight)
    if (journals.length === 0 && Object.keys(chatMemory).length === 0) {
      return null;
    }
    
    // 2. Build context prompt
    let contextParts = [];
    
    if (journals.length > 0) {
      const journalTexts = journals.map(j => `"${j.title}: ${j.description}"`).join(', ');
      contextParts.push(`Journal entries: ${journalTexts}`);
    }
    
    if (chatMemory.conversation_history && chatMemory.conversation_history.length > 0) {
      const recentChats = chatMemory.conversation_history.slice(-3); // Last 3 exchanges
      const chatSummary = recentChats.map(c => c.user_message).join('; ');
      contextParts.push(`Recent chat topics: ${chatSummary}`);
    }
    
    const context = contextParts.join('. ');
    
    // 3. Create insight request prompt
    const langCode = language.split('-')[0].toUpperCase();
    const prompt = `[LANGUAGE: ${langCode}] Based on this user's activity today: ${context}. 
    
Please provide a brief personalized insight about their emotional state and well-being in EXACTLY 50 words or less. Focus on patterns, encouragement, and actionable suggestions. Be warm and supportive.`;
    
    // 4. Call Gradio AI
    const client = await Client.connect(GRADIO_SPACE);
    const result = await client.predict(GRADIO_ENDPOINT, {
      text: prompt,
      memory_json: JSON.stringify({}) // Empty memory for insight generation
    });
    
    const responseData = result.data && result.data[0];
    if (!responseData) {
      throw new Error('Empty AI response');
    }
    
    let parsedResponse;
    try {
      parsedResponse = typeof responseData === 'string' 
        ? JSON.parse(responseData) 
        : responseData;
    } catch (parseError) {
      throw new Error('Invalid AI response format');
    }
    
    const insightText = parsedResponse.counselor_reply;
    
    if (!insightText) {
      throw new Error('No insight text in response');
    }
    
    // 5. Truncate to 50 words if needed
    const words = insightText.trim().split(/\s+/);
    const truncated = words.slice(0, 50).join(' ');
    
    // 6. Save to database
    const supabase = getSupabase(token);
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_insights')
      .upsert(
        {
          user_id: userId,
          insight_text: truncated,
          insight_date: today,
          source_data: {
            journal_count: journals.length,
            has_chat: Object.keys(chatMemory).length > 0,
            generated_at: new Date().toISOString()
          }
        },
        { onConflict: 'user_id,insight_date' }
      )
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error('Insight generation error:', error);
    throw new Error(`Failed to generate insight: ${error.message}`);
  }
};

/**
 * Get today's insight for user
 */
const getTodayInsight = async (userId, token) => {
  const supabase = getSupabase(token);
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('insight_date', today)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

/**
 * Clear chat memory if older than 24h
 */
const clearOldChatMemory = async (userId, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('user_ai_memory')
    .select('updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  
  if (data?.updated_at) {
    const updatedAt = new Date(data.updated_at);
    const now = new Date();
    const hoursDiff = (now - updatedAt) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      await supabase
        .from('user_ai_memory')
        .update({ memory_json: {}, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      return true;
    }
  }
  
  return false;
};

module.exports = {
  generateInsight,
  getTodayInsight,
  clearOldChatMemory,
  getTodayJournals,
  getChatMessages
};
