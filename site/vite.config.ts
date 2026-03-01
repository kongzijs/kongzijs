import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
    base: command === "build" ? "/kongzijs/" : "/",
    plugins: [react()],
    resolve: {
        dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
        force: true,
    },
}));
