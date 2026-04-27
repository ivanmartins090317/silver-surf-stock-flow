import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// trim: na Vercel costuma haver newline/espaço extra ao colar (quebra o DNS)
const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

if (!url || !anonKey) {
  throw new Error(
    'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env (veja .env.example).',
  );
}

try {
  const parsed = new URL(url);
  if (!parsed.hostname.endsWith('.supabase.co')) {
    console.warn(
      '[Supabase] O hostname de VITE_SUPABASE_URL não parece um projecto supabase.co:',
      parsed.hostname,
    );
  }
} catch {
  throw new Error(
    `VITE_SUPABASE_URL inválida: "${url}". Deve ser algo como https://xxxxx.supabase.co`,
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(url, anonKey);