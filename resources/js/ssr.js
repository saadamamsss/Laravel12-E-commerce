import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import { createSSRApp, h } from "vue";
import { ZiggyVue } from "ziggy-js";
import { pinia } from "./stores";

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pages = import.meta.glob("./Pages/**/*.vue", { eager: true });
            return pages[`./Pages/${name}.vue`];
        },
        setup({ App, props, plugin }) {
            return createSSRApp({
                render: () => h(App, props),
            })
                .use(plugin)
                .use(pinia)
                .use(ZiggyVue);
        },
        progress: {
            color: "#ff2832",
        },
    })
);
