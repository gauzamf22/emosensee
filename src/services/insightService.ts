import { API_BASE_URL } from '../config/api';
import { supabase } from '../lib/supabase';

export interface DailyInsight {
  insight_text: string;
  insight_date: string;
  created_at: string;
}

interface InsightResponse {
  success: boolean;
  data: DailyInsight | null;
  message?: string;
}

export async function getDailyInsight(): Promise<DailyInsight | null> {
  try {
    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.error('getDailyInsight: No active session');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/insights/daily`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      console.error(`getDailyInsight: HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const json: InsightResponse = await response.json();
    
    if (!json.success) {
      console.error('getDailyInsight: API request failed:', json.message);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error('getDailyInsight: Exception caught:', error);
    return null;
  }
}
