const { createClient } = require('@supabase/supabase-js');

const getSupabase = (token) => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${token}` } }
});

const createJournal = async (userId, title, description, token) => {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('journals')
    .insert([{ user_id: userId, title, description }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getAllJournals = async (userId, token) => {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); 

  if (error) throw error;
  return data;
};

const getJournalById = async (userId, journalId, token) => {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('user_id', userId)
    .eq('id', journalId)
    .single();

  if (error) throw error;
  return data;
};

const updateJournal = async (userId, journalId, title, description, token) => {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('journals')
    .update({ title, description }) 
    .eq('user_id', userId)
    .eq('id', journalId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteJournal = async (userId, journalId, token) => {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from('journals')
    .delete()
    .eq('user_id', userId)
    .eq('id', journalId);

  if (error) throw error;
  return data;
};

module.exports = {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal
};