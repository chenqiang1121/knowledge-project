import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const managerApiTarget = process.env.VITE_PROXY_API_TARGET ?? "http://localhost:8081";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: managerApiTarget,
        changeOrigin: true,
      },
    },
  },
});
