import {
    mercado_better_equal_elems,
    mercado_clone_all_zan_menus,
    mercado_control_mobile_menu,
    mercado_control_panel,
    mercado_countdown,
    mercado_google_maps,
    mercado_innit_carousel,
    mercado_price_range,
    mercado_product_slider,
    mercado_remove_product_in_cart,
    mercado_sticky_menu,
    mercado_tabs,
    mercado_toggle_slide_menu,
    mercado_toggle_vertical_main_menu,
    saad,
    saad_google_maps,
} from "./functions";

export const InitallFunctions = () => {
    // mercado_chosen(window.Zepto || window.jQuery, window, document);
    mercado_clone_all_zan_menus(
        window.Zepto || window.jQuery,
        window,
        document
    );
    mercado_control_mobile_menu(
        window.Zepto || window.jQuery,
        window,
        document
    );
    mercado_control_panel(window.Zepto || window.jQuery, window, document);
    mercado_tabs(window.Zepto || window.jQuery, window, document);
    mercado_countdown(window.Zepto || window.jQuery, window, document);
    mercado_better_equal_elems(window.Zepto || window.jQuery, window, document);
    mercado_toggle_slide_menu(window.Zepto || window.jQuery, window, document);
    mercado_price_range(window.Zepto || window.jQuery, window, document);
    mercado_remove_product_in_cart(
        window.Zepto || window.jQuery,
        window,
        document
    );
    mercado_product_slider(window.Zepto || window.jQuery, window, document);
    mercado_toggle_vertical_main_menu(
        window.Zepto || window.jQuery,
        window,
        document
    );

    // mercado_sticky_menu(window.Zepto || window.jQuery, window, document);
    // mercado_google_maps(window.Zepto || window.jQuery, window, document);
    saad_google_maps(window.Zepto || window.jQuery, window, document);
    saad(window.Zepto || window.jQuery, window, document);
    mercado_innit_carousel(window.Zepto || window.jQuery, window, document);
    mercado_price_range(window.Zepto || window.jQuery, window, document);
};
