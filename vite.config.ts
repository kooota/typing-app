/// <reference types="vitest/config" />
import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const wakabaLocal = path.resolve(__dirname, "src/wakaba.local.ts");
const wakabaFallback = path.resolve(__dirname, "src/wakaba.local.fallback.ts");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@wakaba-local": existsSync(wakabaLocal) ? wakabaLocal : wakabaFallback,
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
