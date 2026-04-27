import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  // Vercel injeta as envs em process.env; loadEnv() só lê ficheiros .env no disco
  const supabaseUrl =
    fileEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    fileEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (mode === "production") {
    if (!supabaseUrl?.trim() || !supabaseKey?.trim()) {
      throw new Error(
        "Build de produção sem VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
          "Define-as na Vercel (Settings → Environment Variables) e redeploy.",
      );
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
