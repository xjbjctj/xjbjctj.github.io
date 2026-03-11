import {defineConfig} from 'vite'
export default defineConfig({
    plugins: [
    ],
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                'login': './vue/entry/login.js'
            },
            output: {
                dir: './static/js',
                format: 'iife',
                entryFileNames: '[name].min.js',
            }
        },
    }
})