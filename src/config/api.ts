export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AI_CHAT: '/api/ai/chat',
  AI_ANALYZE: '/api/ai/analyze',
  AI_INSIGHT: '/api/ai/insight',
} as const;
