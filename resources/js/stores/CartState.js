import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartState = defineStore("CART", () => {
    // State
    const count = ref(0);
    const cartInfo = ref({});
    function setCartCount(cartcount) {
        count.value = cartcount;
    }

    function setCartInfo(cart) {
        cartInfo.value = cart;
    }

    return {
        count,
        setCartCount,
    };
});
