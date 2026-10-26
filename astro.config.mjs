import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://azure179.github.io",
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/about": "/contact/",
    "/zh/about": "/zh/contact/",
  },
  build: { format: "directory" },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/template/") &&
        !page.endsWith("/404/") &&
        !/\/about\/?$/.test(page),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
