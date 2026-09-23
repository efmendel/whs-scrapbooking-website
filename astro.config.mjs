// @ts-check
import { defineConfig } from 'astro/config';

// Static site: `npm run build` writes plain HTML/CSS/JS to ./dist.
// Set `site` to the real URL once it's hosted (used for the canonical link).
export default defineConfig({
  site: 'https://whs-scrapbooking.netlify.app',
});
