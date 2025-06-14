import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    // Support for custom domain
    host: "0.0.0.0",
    port: 3000,
    strictPort: false,
    cors: true,
    proxy: {
      // Add any API proxies here if needed
      // '/api': {
      //   target: 'https://your-api-server.com',
      //   changeOrigin: true,
      //   secure: true,
      // }
    },
  },
  preview: {
    port: 4173,
    host: "0.0.0.0",
  },
});
