const moodService = require('../services/moodService');

const logMoodToday = async (req, res, next) => {
  try {
    const { mood } = req.body;
    const userId = req.user.id;
    const token = req.token;

    const validMoods = ['angry', 'anxiety', 'sad', 'neutral', 'happy'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ success: false, message: 'Pilihan mood tidak valid' });
    }

    const savedMood = await moodService.upsertMood(userId, mood, token);

    res.status(200).json({
      success: true,
      message: 'Mood hari ini berhasil disimpan / diperbarui',
      data: savedMood
    });
  } catch (error) {
    next(error);
  }
};

const checkTodayStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    const moodData = await moodService.getTodayMood(userId, token);

    res.status(200).json({
      success: true,
      data: {
        already_logged: !!moodData, 
        today_mood: moodData ? moodData.mood : null
      }
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;
    
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parameter startDate dan endDate wajib diisi (Format: YYYY-MM-DD)' 
      });
    }

    const historyData = await moodService.getMoodHistoryByRange(userId, startDate, endDate, token);

    res.status(200).json({
      success: true,
      message: `Riwayat mood dari tanggal ${startDate} sampai ${endDate}`,
      data: historyData
    });
  } catch (error) {
    next(error);
  }
};

const deleteToday = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    const deletedData = await moodService.deleteTodayMood(userId, token);

    res.status(200).json({
      success: true,
      message: 'Mood hari ini berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    const allMoods = await moodService.getAllMoods(userId, token);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil semua riwayat mood',
      data: allMoods
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { logMoodToday, checkTodayStatus, getHistory, deleteToday, getAll };