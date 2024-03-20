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
    },
})
