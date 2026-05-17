import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://www.whatsdiscount.co.uk',
});
