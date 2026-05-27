-- Create user_ai_memory table for storing AI conversation memory
CREATE TABLE IF NOT EXISTS user_ai_memory (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_json JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups by updated_at
CREATE INDEX IF NOT EXISTS idx_user_ai_memory_updated ON user_ai_memory(updated_at);

-- Add comment for documentation
COMMENT ON TABLE user_ai_memory IS 'Stores AI conversation memory for each user';
COMMENT ON COLUMN user_ai_memory.memory_json IS 'JSON object containing conversation history, emotion stats, and session count';
