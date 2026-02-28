/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
    },
    plugins: [
        react(),
        dts({
            include: ["src"],
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "MarkdownEditor",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "@tiptap/react",
                "@tiptap/pm",
                "@tiptap/starter-kit",
                "tiptap-markdown",
                "lucide-react",
            ],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
