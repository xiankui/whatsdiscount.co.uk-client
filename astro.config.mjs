import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  //adapter: cloudflare({
  //  platformProxy: {
  //    enabled: true,
  //  },
  //}),
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://www.whatsdiscount.co.uk',
});
