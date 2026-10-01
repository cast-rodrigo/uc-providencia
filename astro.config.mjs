// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// La URL pública se edita en src/data/sitio.json ("urlSitio").
const sitio = JSON.parse(readFileSync(new URL('./src/data/sitio.json', import.meta.url), 'utf-8'));

// https://astro.build/config
export default defineConfig({
  site: sitio.urlSitio,
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
