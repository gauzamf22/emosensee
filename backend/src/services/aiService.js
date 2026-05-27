const connectToAI = async () => {
  const spaceUrl = process.env.HF_SPACE_URL;
  
  const { Client } = await import("@gradio/client");
  
  return await Client.connect(spaceUrl);
};

const getChatResponse = async (message, memoryData) => {
  try {
    const client = await connectToAI();
    const memoryString = memoryData ? JSON.stringify(memoryData) : "{}";
    
    const result = await client.predict("/api_chat", { 
      text: message, 
      memory_json: memoryString
    });
    
    const responseData = typeof result.data[0] === "string" ? JSON.parse(result.data[0]) : result.data[0];
    
    return {
      counselorReply: responseData.counselor_reply,
      analytics: responseData.analytics,
      updatedMemory: responseData.updated_memory
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mendapatkan respons dari AI Chatbot");
  }
};

const analyzeText = async (text) => {
  try {
    const client = await connectToAI();
    const result = await client.predict("/gradio_analyze_only", { 
      text: text 
    });
    return typeof result.data[0] === "string" ? JSON.parse(result.data[0]) : result.data[0];
  } catch (error) {
    console.error(error);
    throw new Error("Gagal menganalisis teks pengguna");
  }
};

module.exports = { getChatResponse, analyzeText };