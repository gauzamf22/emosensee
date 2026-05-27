const aiService = require('../services/aiService');
const supabase = require('../config/supabase'); 

const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong" });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('memory_data')
      .eq('user_id', userId)
      .eq('chat_date', today)
      .maybeSingle();

    const currentMemory = existingSession ? existingSession.memory_data : null;

    const aiData = await aiService.getChatResponse(message, currentMemory);

    const { error: dbError } = await supabase
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        chat_date: today,
        last_message: message,
        memory_data: aiData.updatedMemory,
        analysis_data: aiData.analytics
      }, { onConflict: 'user_id,chat_date' });

    if (dbError) {
      console.error(dbError);
    }

    res.status(200).json({
      success: true,
      data: aiData.counselorReply
    });
  } catch (error) {
    next(error);
  }
};

const analyzeUserText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Teks tidak boleh kosong" });
    }

    const analysisResult = await aiService.analyzeText(text);
    
    res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    next(error);
  }
};

const generateAIInsight = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const todayDateStr = new Date().toLocaleDateString('en-CA'); 

    const { data: chatSession } = await supabase
      .from('chat_sessions')
      .select('last_message, memory_data')
      .eq('user_id', userId)
      .eq('chat_date', todayDateStr)
      .maybeSingle();

    const { data: journals } = await supabase
      .from('journals')
      .select('title, description')
      .eq('user_id', userId)
      .gte('created_at', `${todayDateStr}T00:00:00`)
      .lte('created_at', `${todayDateStr}T23:59:59`)
      .order('created_at', { ascending: false });

    console.log("=== DEBUG INSIGHT ===");
console.log("User ID dari Request:", userId);
// console.log("Mencari tanggal (ISO):", startOfDay.toISOString(), "hingga", endOfDay.toISOString());
console.log("Hasil Chat Session:", chatSession);
console.log("Hasil Jurnal:", journals);
console.log("=====================");

    if (!chatSession && (!journals || journals.length === 0)) {
      return res.status(404).json({ 
        success: false, 
        message: "Belum ada aktivitas chat atau jurnal harian untuk user ini hari ini" 
      });
    }

    let chatContext = "Tidak ada aktivitas chat hari ini.";
    if (chatSession?.memory_data?.history) {
      chatContext = chatSession.memory_data.history
        .map(chat => `User: ${chat.user || ''}\nAI: ${chat.ai || ''}`)
        .join('\n');
    }

    let journalContext = "User belum menulis jurnal hari ini.";
    if (journals && journals.length > 0) {
      journalContext = journals
        .map(j => `Judul: ${j.title}\nDeskripsi: ${j.description}`)
        .join('\n\n');
    }

    const insightPrompt = `[SISTEM: Analisis aktivitas user hari ini untuk evaluasi mental dan saran harian. WAJIB balas HANYA dalam 1 paragraf utuh (maksimal 50 kata). Sampaikan secara profesional dan empati.]\n\nDATA AKTIVITAS:\n[CHAT]:\n${chatContext}\n\n[JURNAL]:\n${journalContext}`;

    const currentMemory = chatSession ? chatSession.memory_data : null;
    const aiData = await aiService.getChatResponse(insightPrompt, currentMemory);

    const { data: insightData, error: insightError } = await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        source_type: 'daily_summary',
        insight_text: aiData.counselorReply
      })
      .select()
      .single();

    if (insightError) {
      console.error(insightError);
    }

    res.status(200).json({
      success: true,
      data: insightData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { chatWithAI, analyzeUserText, generateAIInsight };
