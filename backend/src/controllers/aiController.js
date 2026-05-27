const aiService = require('../services/aiService');
const insightService = require('../services/insightService');

/**
 * Get user's AI conversation memory
 * GET /api/ai/memory
 * Returns: { success: true, data: { conversation_history, lastUpdated } }
 */
const getMemory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    // Get memory from database (includes 24h lazy clear)
    const supabase = aiService.getSupabase(token);
    const { data, error } = await supabase
      .from('user_ai_memory')
      .select('memory_json')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    // Return empty structure if no memory exists
    if (!data?.memory_json) {
      return res.status(200).json({
        success: true,
        data: {
          conversation_history: [],
          lastUpdated: null
        }
      });
    }

    const memory = data.memory_json;

    // Check if memory has lastUpdated timestamp
    if (!memory.lastUpdated) {
      // Old format without timestamp, treat as expired
      return res.status(200).json({
        success: true,
        data: {
          conversation_history: [],
          lastUpdated: null
        }
      });
    }

    // Check if memory is older than 24 hours
    const lastUpdated = new Date(memory.lastUpdated);
    const now = new Date();
    const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      // Memory expired, return empty
      return res.status(200).json({
        success: true,
        data: {
          conversation_history: [],
          lastUpdated: null
        }
      });
    }

    // Return the full memory structure
    res.status(200).json({
      success: true,
      data: {
        conversation_history: memory.conversation_history || [],
        lastUpdated: memory.lastUpdated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle AI chat message
 * POST /api/ai/chat
 * Body: { message: string, language?: 'id-ID' | 'en-US' }
 * Returns: { success: true, data: { reply, analytics } }
 */
const chat = async (req, res, next) => {
  try {
    const { message, language } = req.body;
    const userId = req.user.id;
    const token = req.token;

    // Validate message
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pesan tidak boleh kosong' 
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Format pesan tidak valid' 
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pesan tidak boleh kosong' 
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pesan terlalu panjang (maksimal 5000 karakter)' 
      });
    }

    // Send message to AI service
    const result = await aiService.sendMessageToAI(userId, message.trim(), token, language);

    // Trigger insight generation in background (fire-and-forget)
    insightService.generateInsight(userId, token, language || 'id-ID')
      .catch(err => console.error('Background insight generation failed:', err));

    res.status(200).json({
      success: true,
      data: {
        reply: result.reply,
        analytics: result.analytics
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, getMemory };
