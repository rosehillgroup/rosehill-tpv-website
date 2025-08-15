-- Create trigger to automatically translate installations
-- This will call the Edge Function whenever a new installation is added or updated

-- Function to call the translation Edge Function
CREATE OR REPLACE FUNCTION trigger_installation_translation()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  payload JSONB;
  response TEXT;
BEGIN
  -- Only trigger translation for new records or when English content changes
  IF TG_OP = 'INSERT' OR (
    TG_OP = 'UPDATE' AND (
      OLD.title IS DISTINCT FROM NEW.title OR
      OLD.location IS DISTINCT FROM NEW.location OR  
      OLD.description IS DISTINCT FROM NEW.description OR
      OLD.application IS DISTINCT FROM NEW.application OR
      OLD.title_en IS DISTINCT FROM NEW.title_en OR
      OLD.location_en IS DISTINCT FROM NEW.location_en OR
      OLD.description_en IS DISTINCT FROM NEW.description_en OR
      OLD.application_en IS DISTINCT FROM NEW.application_en
    )
  ) THEN
    
    -- Build the Edge Function URL
    function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/translate-installation';
    
    -- If supabase_url setting is not available, try to construct from current context
    IF function_url IS NULL OR function_url = '/functions/v1/translate-installation' THEN
      -- Fallback: assume local development or extract from environment
      function_url := 'https://otidaseqlgubqzsqazqt.supabase.co/functions/v1/translate-installation';
    END IF;
    
    -- Prepare payload
    payload := jsonb_build_object(
      'id', NEW.id::text,
      'languages', ARRAY['fr', 'de', 'es']
    );
    
    -- Log the translation request
    INSERT INTO translation_logs (installation_id, trigger_type, status, created_at)
    VALUES (NEW.id, TG_OP, 'requested', NOW())
    ON CONFLICT DO NOTHING;
    
    -- Call the Edge Function asynchronously using pg_net extension
    -- Note: This requires the pg_net extension to be enabled
    BEGIN
      SELECT net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := payload
      ) INTO response;
      
      -- Log successful trigger
      INSERT INTO translation_logs (installation_id, trigger_type, status, response, created_at)
      VALUES (NEW.id, TG_OP, 'triggered', response, NOW())
      ON CONFLICT (installation_id, trigger_type) DO UPDATE SET
        status = 'triggered',
        response = EXCLUDED.response,
        created_at = EXCLUDED.created_at;
        
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the main operation
      INSERT INTO translation_logs (installation_id, trigger_type, status, error_message, created_at)
      VALUES (NEW.id, TG_OP, 'error', SQLERRM, NOW())
      ON CONFLICT (installation_id, trigger_type) DO UPDATE SET
        status = 'error',
        error_message = EXCLUDED.error_message,
        created_at = EXCLUDED.created_at;
      
      -- Still return NEW to allow the main operation to complete
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create translation logs table to track translation requests
CREATE TABLE IF NOT EXISTS translation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'INSERT' or 'UPDATE'
  status TEXT NOT NULL, -- 'requested', 'triggered', 'completed', 'error'
  response TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(installation_id, trigger_type)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_translation_logs_installation_id ON translation_logs(installation_id);
CREATE INDEX IF NOT EXISTS idx_translation_logs_status ON translation_logs(status);
CREATE INDEX IF NOT EXISTS idx_translation_logs_created_at ON translation_logs(created_at);

-- Create the trigger
DROP TRIGGER IF EXISTS auto_translate_installation ON installations;
CREATE TRIGGER auto_translate_installation
  AFTER INSERT OR UPDATE ON installations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_installation_translation();

-- Manual translation function for existing records
CREATE OR REPLACE FUNCTION translate_existing_installations(batch_size INTEGER DEFAULT 5)
RETURNS TEXT AS $$
DECLARE
  installation_record RECORD;
  function_url TEXT;
  payload JSONB;
  response TEXT;
  count INTEGER := 0;
BEGIN
  function_url := 'https://otidaseqlgubqzsqazqt.supabase.co/functions/v1/translate-installation';
  
  -- Process installations that don't have translations yet
  FOR installation_record IN 
    SELECT id, title 
    FROM installations 
    WHERE (title_fr IS NULL OR title_de IS NULL OR title_es IS NULL)
    AND title IS NOT NULL
    ORDER BY created_at DESC
    LIMIT batch_size
  LOOP
    payload := jsonb_build_object(
      'id', installation_record.id::text,
      'languages', ARRAY['fr', 'de', 'es']
    );
    
    BEGIN
      SELECT net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := payload
      ) INTO response;
      
      count := count + 1;
      
      -- Add delay to avoid rate limiting
      PERFORM pg_sleep(2);
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error and continue
      INSERT INTO translation_logs (installation_id, trigger_type, status, error_message, created_at)
      VALUES (installation_record.id, 'MANUAL', 'error', SQLERRM, NOW());
    END;
  END LOOP;
  
  RETURN 'Triggered translation for ' || count || ' installations';
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON FUNCTION trigger_installation_translation() IS 'Automatically triggers translation when installations are created or updated';
COMMENT ON FUNCTION translate_existing_installations(INTEGER) IS 'Manually trigger translation for existing installations that need translation';
COMMENT ON TABLE translation_logs IS 'Logs translation requests and their status for debugging and monitoring';