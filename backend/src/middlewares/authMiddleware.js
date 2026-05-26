const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  try {
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan atau format salah' });
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token ke Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa' });
    }

    req.user = data.user;
    req.token = token; 
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireAuth;