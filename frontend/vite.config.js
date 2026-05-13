import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          charts: ["chart.js", "react-chartjs-2"],
          recharts: ["recharts"],
          exports: ["jspdf", "exceljs", "pptxgenjs"],
          vendor: ["axios", "lucide-react"]
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
