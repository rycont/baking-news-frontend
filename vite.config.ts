import { defineConfig } from 'vite'
import { glob } from 'glob'
import ogPlugin from 'vite-plugin-open-graph'

import { resolve } from 'path'

const pages = await glob('**/*.html', {
    ignore: ['node_modules/**', 'dist/**'],
})
const entryPoint = Object.fromEntries(
    pages.map((path) => [path, resolve(__dirname, path)])
)

export default defineConfig({
    appType: 'mpa',
    build: {
        target: 'ESNext',
        rollupOptions: {
            input: entryPoint,
        },
    },
    plugins: [
        ogPlugin({
            basic: {
                title: 'Baking News: 꼭 너만을 위한 AI 뉴스레터',
                url: 'https://baking-news.vercel.app',
                image: '/image/og.png',
                type: 'website',
                description:
                    '꼭 너만을 위한 AI 뉴스레터, AI Newsletter only for you',
                locale: 'ko_KR',
                siteName: 'Baking News',
            },
        }),
    ],
})
