/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MARVEL_API_PUBLIC_KEY: string
    readonly VITE_MARVEL_API_PRIVATE_KEY: string
    readonly VITE_MARVEL_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}