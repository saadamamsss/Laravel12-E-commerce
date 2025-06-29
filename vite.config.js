import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
import purgeCss from "vite-plugin-purgecss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/js/app.js",
                "resources/css/app.css",
                "resources/css/font-awesome.min.css",
                "resources/css/bootstrap.min.css",
                "resources/css/owl.carousel.min.css",
                "resources/css/flexslider.css",
                "resources/css/style.css",
                "resources/css/color-01.css",
            ],

            postcss: [tailwindcss(), autoprefixer()],
            ssr: "resources/js/ssr.js",
            refresh: true,
        }),
   
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    optimizeDeps: {
        include: ["pusher-js", "laravel-echo"],
    },
});
