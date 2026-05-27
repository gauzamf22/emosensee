import { API_BASE_URL } from '../config/api';
import { supabase } from '../lib/supabase';

export interface Journal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface JournalResponse {
  success: boolean;
  message?: string;
  data: Journal[];
  pagination?: Pagination;
}

export interface CreateJournalRequest {
  title: string;
  description: string;
}

export interface CreateJournalResponse {
  success: boolean;
  message?: string;
  data: Journal;
}

export async function createJournal(title: string, description: string): Promise<Journal> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${API_BASE_URL}/api/journals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: CreateJournalResponse = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Failed to create journal');
  }

  return json.data;
}

export async function getJournals(limit: number = 10, offset: number = 0): Promise<JournalResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${API_BASE_URL}/api/journals?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: JournalResponse = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Failed to fetch journals');
  }

  return json;
}
