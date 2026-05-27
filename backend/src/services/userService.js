const supabase = require('../config/supabase');
const { createClient } = require('@supabase/supabase-js');

const signUpUser = async (email, username, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) throw error;
  return data;
};

const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

const findEmailByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();

  if (error || !data) throw new Error('Username tidak ditemukan');
  return data.email;
};

const getGoogleOAuthUrl = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'http://localhost:3000/api/auth/callback' } 
  });

  if (error) throw error;
  return data.url;
};

const exchangeCode = async (code) => {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data;
};

const sendResetPasswordEmail = async (email, redirectTo) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo, 
  });

  if (error) throw error;
  return data;
};

const updatePasswordWithToken = async (newPassword, token) => {
  const supabase = getSupabase(token); 
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return data;
};

const updateProfile = async (userId, { username, fullname, birth_date }, token) => {
  const scopedSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data, error } = await scopedSupabase
    .from('profiles')
    .update({ 
      username, 
      fullname, 
      birth_date 
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Username sudah digunakan oleh orang lain');
    throw error;
  }
  
  return data;
};

const updateSettings = async (userId, language, notificationsEnabled, token) => {
  const scopedSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data, error } = await scopedSupabase
    .from('profiles')
    .update({ 
      language: language, 
      notifications_enabled: notificationsEnabled 
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  signUpUser,
  signInWithEmail,
  findEmailByUsername,
  getGoogleOAuthUrl,
  exchangeCode,
  sendResetPasswordEmail,
  updatePasswordWithToken,
  updateProfile,
  updateSettings
};