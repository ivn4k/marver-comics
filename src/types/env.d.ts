/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MARVEL_API_PUBLIC_KEY: string
    readonly VITE_MARVEL_API_TS: string
    readonly VITE_MARVEL_API_HASH: string
    readonly VITE_MARVEL_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}