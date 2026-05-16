/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly CMS_API_URL: string;
  readonly SITE_ID: string;
  readonly IMG_URL: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
