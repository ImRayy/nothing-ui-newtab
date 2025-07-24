import { crx, type ManifestV3Export } from "@crxjs/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa"

const manifest: ManifestV3Export = {
  homepage_url: "/",
  manifest_version: 3,
  name: "Nothing UI Newtab",
  short_name: "Nothing UI Newtab",
  version: "1.1",
  host_permissions: [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
  ],
  web_accessible_resources: [
    {
      resources: ["*.ttf", "*.woff", "*.woff2", "*.ttf", "*.eot"],
      matches: ["<all_urls>"],
    },
  ],
  chrome_url_overrides: {
    newtab: "index.html",
  },
  permissions: ["tabs", "scripting"],
}

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: "prompt",
  injectRegister: false,

  manifest,

  workbox: {
    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
  },

  devOptions: {
    enabled: false,
    navigateFallback: "index.html",
    suppressWarnings: true,
    type: "module",
  },
}

export default defineConfig({
  plugins: [react(), crx({ manifest }), VitePWA(pwaOptions)],
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
