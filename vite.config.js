// ══════════════════════════════════════════════════════
// vite.config.js
// 로컬 개발 시 /api/chat 요청을 프록시로 처리
// ══════════════════════════════════════════════════════

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
