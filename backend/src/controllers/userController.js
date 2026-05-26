const userService = require('../services/userService');

const updateProfile = async (req, res, next) => {
  try {
    const { username, fullname, birth_date } = req.body;
    const userId = req.user.id;   
    const token = req.token;   

    const updatedProfile = await userService.updateProfile(userId, { username, fullname, birth_date }, token);

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { language, notifications_enabled } = req.body;
    const userId = req.user.id;
    const token = req.token;

    const updatedProfile = await userService.updateSettings(
      userId, 
      language, 
      notifications_enabled, 
      token
    );

    res.status(200).json({
      success: true,
      message: 'Pengaturan berhasil diperbarui',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  updatePreferences
};