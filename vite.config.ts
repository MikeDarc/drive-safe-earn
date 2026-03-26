import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ["favicon.png", "pwa-192.png", "pwa-512.png", "pwa-192-maskable.png", "pwa-512-maskable.png"],
      manifest: {
        name: "DriverPro - Copiloto para Motoristas",
        short_name: "DriverPro",
        description: "Cálculo de ganhos e segurança para motoristas de aplicativo. Monitore corridas, tempo e maximize seus ganhos por KM rodado.",
        theme_color: "#0d1117",
        background_color: "#0d1117",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "pt-BR",
        dir: "ltr",
        categories: ["productivity", "utilities", "finance"],
        iarc_rating_id: "",
        prefer_related_applications: false,
        icons: [
          { src: "/pwa-48.png", sizes: "48x48", type: "image/png", purpose: "any" },
          { src: "/pwa-72.png", sizes: "72x72", type: "image/png", purpose: "any" },
          { src: "/pwa-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
          { src: "/pwa-128.png", sizes: "128x128", type: "image/png", purpose: "any" },
          { src: "/pwa-144.png", sizes: "144x144", type: "image/png", purpose: "any" },
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/pwa-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.jpg",
            sizes: "750x1334",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Dashboard do DriverPro no celular",
          },
          {
            src: "/screenshot-desktop.jpg",
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
            label: "Dashboard do DriverPro no desktop",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
