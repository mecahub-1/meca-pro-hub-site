// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jswapqasgatjjwgbrsdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2FwcWFzZ2F0amp3Z2Jyc2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzA5OTUsImV4cCI6MjA2MzQwNjk5NX0.nTR-6c7gs-ZrXXngBIolzxVV-ny1DIcSILUMWy6ChFs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);