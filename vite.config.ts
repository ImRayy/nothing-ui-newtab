import { crx } from "@crxjs/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import manifest from "./manifest.json"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
  server: {
    host: "localhost",
    port: 3000,
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
})
