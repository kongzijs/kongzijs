import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 在开发模式下，直接使用源码而不是构建产物
      "@kongzijs/flf-core": path.resolve(__dirname, "../../packages/flf-core/src"),
      "@kongzijs/lesson-builder": path.resolve(__dirname, "../../packages/lesson-builder/src"),
      "@kongzijs/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  optimizeDeps: {
    exclude: ["@kongzijs/flf-core", "@kongzijs/lesson-builder", "@kongzijs/ui"],
  },
});
