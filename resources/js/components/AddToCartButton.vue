<template>
    <button
        class="btn btn-prime d-flex justify-content-center items-center gap-3"
        @click.prevent="clickaddtocart()"
        :disabled="loading || props.disabled ? true : undefined"
    >
        <Spinner v-if="loading" size="small" />
        <span>Add To Cart </span>
    </button>
</template>

<script setup>
import Spinner from "./Spinner.vue";
import { ref } from "vue";
import { useDrawerStore } from "@/stores/DrawerState.js";
import { API } from "@/utils/api.js";
import { useCartState } from "../stores/CartState";

const DRAWER = useDrawerStore();
const CART = useCartState();

const props = defineProps({
    productId: {
        type: Number,
        default: undefined,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    drawer: {
        type: Boolean,
        default: true,
    },
    disabled: { type: Boolean, default: false },
    variantId: { type: Number, default: undefined },
});

const loading = ref(false);

async function clickaddtocart() {
    if (props.drawer) {
        // get product data;
        const { data } = await API.get("find-product-withId", {
            params: { id: props.productId },
        });
        DRAWER.setDrawerContent(data);
        DRAWER.toggleDrawer();
    } else {
        await AddToCart();
    }
}

async function AddToCart() {
    loading.value = true;
    try {
        const { data } = await API.post("add-product-to-cart", {
            productId: props.productId,
            variantId: props.variantId,
            quantity: props.quantity,
        });

        console.log(data.count);

        CART.setCartCount(data.count);
    } catch (error) {
        console.log(error);

        console.log("add to cart faild!");
    } finally {
        loading.value = false;
    }
}
</script>
<style scoped>
.btn-prime {
    padding-block: 10px;
    transition: all 0.3s ease;
    width: 100%;
}
</style>
