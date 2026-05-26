const { createClient } = require('@supabase/supabase-js');
const { getTodayDateString } = require('../utils/dateHelper');
const getSupabase = (token) => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${token}` } }
});

const upsertMood = async (userId, mood, token) => {
  const supabase = getSupabase(token);
  const today = getTodayDateString();

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      { 
        user_id: userId, 
        mood: mood, 
        date_logged: today 
      }, 
      { onConflict: 'user_id,date_logged' } 
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getTodayMood = async (userId, token) => {
  const supabase = getSupabase(token);
  const today = getTodayDateString();

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood, date_logged')
    .eq('user_id', userId)
    .eq('date_logged', today)
    .maybeSingle(); 

  if (error) throw error;
  return data;
};

const getMoodHistoryByRange = async (userId, startDate, endDate, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood, date_logged')
    .eq('user_id', userId)
    .gte('date_logged', startDate) 
    .lte('date_logged', endDate)  
    .order('date_logged', { ascending: true });

  if (error) throw error;
  return data;
};

const deleteTodayMood = async (userId, token) => {
  const supabase = getSupabase(token);
  const today = getTodayDateString();

  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('user_id', userId)
    .eq('date_logged', today);

  if (error) throw error;
  return true;
};

const getAllMoods = async (userId, token) => {
  const supabase = getSupabase(token);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date_logged', { ascending: false });

  if (error) throw error;
  return data;
};

module.exports = { upsertMood, getTodayMood, getMoodHistoryByRange, deleteTodayMood, getAllMoods };