import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (mode === "production") {
    if (!env.VITE_SUPABASE_URL?.trim() || !env.VITE_SUPABASE_ANON_KEY?.trim()) {
      throw new Error(
        "Build de produção sem VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
          "Define-as na Vercel (ou .env) e redeploy — o Vite embute estes valores no build.",
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
