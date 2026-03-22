/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_URL?: string;
  VITE_GROQ_API_KEY?: string;
  // more env variables...
}

interface ImportMeta {
  env: ImportMetaEnv;
}