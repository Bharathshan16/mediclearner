import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-dom") || id.includes("/react/")) {
            return "react-vendor";
          }

          if (id.includes("react-router-dom")) {
            return "router-vendor";
          }

          if (id.includes("@supabase")) {
            return "backend-vendor";
          }

          if (id.includes("@radix-ui") || id.includes("lucide-react")) {
            return "ui-vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
