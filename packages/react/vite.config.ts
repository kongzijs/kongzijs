import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
    // CSS-only build: `vite build --mode css`
    if (mode === "css") {
        return {
            plugins: [],
            build: {
                outDir: "dist",
                emptyOutDir: false,
                rollupOptions: {
                    input: resolve(__dirname, "src/styles.css"),
                    output: {
                        assetFileNames: "styles.css",
                    },
                },
            },
            resolve: {
                alias: { "@": resolve(__dirname, "./src") },
            },
        };
    }

    // Default JS lib build
    return {
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
                name: "BaseComponent",
                formats: ["es", "cjs"],
                fileName: (format) =>
                    `index.${format === "es" ? "mjs" : "cjs"}`,
            },
            rollupOptions: {
                external: ["react", "react-dom", "lucide-react"],
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
        resolve: {
            alias: { "@": resolve(__dirname, "./src") },
        },
    };
});
