import { createClient } from '@supabase/supabase-js'

const SUPA_BASE_URL = process.env.SUPABASE_URL ?? "";
const SUPA_BASE_KEY = process.env.SUPABASE_KEY ?? "";
const supabase = createClient(SUPA_BASE_URL, SUPA_BASE_KEY);

export { supabase as db }