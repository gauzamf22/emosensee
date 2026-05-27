const aiService = require('../services/aiService');

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

module.exports = { chat };
