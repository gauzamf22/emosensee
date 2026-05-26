const userService = require('../services/userService');

const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    const result = await userService.signUpUser(email, username, password);

    res.status(201).json({
      success: true,
      data: result.user
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'email atau username dan password wajib diisi' });
    }

    const email = identifier.includes('@') 
      ? identifier 
      : await userService.findEmailByUsername(identifier);

    const result = await userService.signInWithEmail(email, password);

    res.status(200).json({
      success: true,
      token: result.session.access_token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const url = await userService.getGoogleOAuthUrl();
    res.status(200).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

const callback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code tidak ditemukan' });
    }

    const result = await userService.exchangeCode(code);

    res.status(200).json({
      success: true,
      message: 'Google Login berhasil!',
      token: result.session.access_token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi' });
    }

    const redirectToUrl = 'http://localhost:5173/reset-password'; 

    await userService.sendResetPasswordEmail(email, redirectToUrl);

    res.status(200).json({
      success: true,
      message: 'Link tautan reset password telah dikirim ke email kamu.'
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordReset = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const token = req.token; 

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password baru wajib diisi dan minimal 6 karakter' 
      });
    }

    await userService.updatePasswordWithToken(newPassword, token);

    res.status(200).json({
      success: true,
      message: 'Password kamu berhasil diperbarui. Silakan login kembali.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  callback,
  forgotPasswordRequest,
  forgotPasswordReset
};