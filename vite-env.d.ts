/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MOCK_RSS_REQUEST?: string
    readonly VITE_MOCK_NEWSLETTER_CREATION?: string
    readonly VITE_IGNORE_DISMISSED_ARTICLES?: string
    readonly VITE_FASTMOCK?: string
    readonly VITE_API_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
