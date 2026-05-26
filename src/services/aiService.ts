import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface ChatResponse {
  success: boolean;
  data: string;
  message?: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
    credentials: 'include', // Include cookies for session auth
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: ChatResponse = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data;
}
