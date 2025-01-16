/// <reference types="vite/types/importMeta.d.ts" />
interface ImportMetaEnv {
    VITE_SERVER_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }


declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";