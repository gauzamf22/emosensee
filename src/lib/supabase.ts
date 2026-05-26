import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://psdjfoayyhipntmvumzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZGpmb2F5eWhpcG50bXZ1bXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1OTE5MjksImV4cCI6MjA5NDE2NzkyOX0.F8ZWU0BMU9_w3W1MJaJgxQICjFp201v4zIlbvjFE3ps';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
