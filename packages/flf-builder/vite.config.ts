/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    resolve: {
        alias: {
            "@borgtj/react": resolve(__dirname, "../react/src/index.ts"),
        },
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
            name: "LessonBuilder",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "@xyflow/react",
                "@kongzijs/flf-core",
                "@quizerjs/core",
                "@quizerjs/react",
                "@quizerjs/i18n", // Added
                "@quizerjs/dsl",
                "@quizerjs/theme",
                "@borgtj/react",
                "lucide-react",
                "sonner",
                "@kongzijs/flf-i18n",
                "@kongzijs/markdown-editor",
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
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/__tests__/setup.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
});
