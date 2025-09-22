    import {defineConfig} from 'vite'
    import {composePlugins, withBase, withReact, withPwa} from "@stageit-labs/vite-config";

    export default defineConfig(composePlugins(
    withBase(),
    withReact(),
    withPwa({
        manifest: {
        name: 'Vite App PWA',
        short_name: 'ViteApp',
        description: 'Vite App with PWA support',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
            {
            src: 'icons/maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png'
            },
            {
            src: 'icons/maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png'
            }
        ]
        },
    }),
    (c) => {
        c.resolve = {

        }
        return c
    }
    ))
