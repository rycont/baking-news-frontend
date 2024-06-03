import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import ogPlugin from 'vite-plugin-open-graph'
import solidSvg from 'vite-plugin-solid-svg'
import solidPlugin from 'vite-plugin-solid'
import { defineConfig } from 'vite'
import { glob } from 'glob'

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
        assetsInlineLimit: 0,
    },
    plugins: [
        vanillaExtractPlugin({
            unstable_mode: 'emitCss',
            identifiers(props) {
                return 'bk-' + (props.debugId?.toLowerCase() || props.hash)
            },
        }),
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
        solidPlugin(),
        solidSvg(),
    ],
    resolve: {
        alias: {
            '@shade': '/shade-ui',
            '@components': '/components',
            '@assets': '/assets',
            '@utils': '/utils',
            '@': __dirname,
        },
    },
})
