import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      srcDir: "src",
      filename: "serviceworker.js",
      registerType: "prompt",
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "MapComponents PWA",
        short_name: "MapComponents PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "apple-icon-180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "favicon-196.png",
            sizes: "196x196",
            type: "image/png",
          },
          {
            src: "manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{pbf,json,js,css,png,svg,html,mbtiles,wasm}"],
        maximumFileSizeToCacheInBytes: 300000000,
      },
    }),
  ],
});
