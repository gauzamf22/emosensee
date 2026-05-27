const insightService = require('../services/insightService');

/**
 * Get today's personalized insight
 */
const getTodayInsight = async (req, res, next) => {
  try {
    const data = await insightService.getTodayInsight(req.user.id, req.token);
    
    if (!data) {
      return res.status(200).json({ 
        success: true, 
        message: 'Belum ada insight hari ini',
        data: null 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Berhasil mengambil insight',
      data 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate new insight (manual trigger)
 */
const generateInsight = async (req, res, next) => {
  try {
    const language = req.body.language || req.headers['accept-language'] || 'id-ID';
    const data = await insightService.generateInsight(req.user.id, req.token, language);
    
    if (!data) {
      return res.status(200).json({
        success: true,
        message: 'Belum ada aktivitas hari ini untuk generate insight',
        data: null
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Insight berhasil di-generate',
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodayInsight,
  generateInsight
};
