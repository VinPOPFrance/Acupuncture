// @ts-check
// Wix-hosted frontend of Seul Acupuntura (Wix Headless migration, 2026-11-19). Config from the project Wix
// generated for the migration; the pages are the static site of ../dist, wrapped by ../scripts/build-wix.mjs.
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import wixPages from "@wix/astro-pages";
import react from "@astrojs/react";
import wixHostingAdapter from "@wix/astro-wix-hosting-adapter";

export default defineConfig({
  integrations: [wix(), wixPages(), react()],
  security: { checkOrigin: false },
  adapter: wixHostingAdapter(),
  image: {
    domains: ["static.wixstatic.com"],
  },
  output: "server",
  // Old Wix URLs (/acupuntura, /contacto…) and the new ones (/acupuntura/) both answer.
  trailingSlash: "ignore",
  // Same as vercel.json: pages of the old Wix site that have no page of the same name.
  redirects: {
    "/quienessomos": "/equipo",
    "/cursos": "/formacion",
    "/galeria": "/equipo",
    "/descripciontratamiento": "/tratamientos",
    "/services-1": "/tratamientos",
    // Service pages of the old Wix site, listed in its sitemap.xml on 2026-11-19.
    "/services-1/acupuntura": "/acupuntura",
    "/services-1/tui-na": "/tuina",
    "/services-1/electropuntura": "/electropuntura",
    "/services-1/manopuntura": "/manopuntura",
    "/services-1/moxibución": "/moxibustion",
    "/services-1/ventosa": "/ventosas",
  },
});
