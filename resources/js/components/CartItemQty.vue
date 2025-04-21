<template>
    <div class="quantity-input d-flex align-items-center py-1 px-2">
        <div class="d-flex gap-2">
            <a
                class="btn btn-reduce m-0"
                :disabled="loader ? true : undefined"
                @click.prevent="UpdateCart(quantity - 1)"
            ></a>
            <a
                class="btn btn-increase m-0"
                :disabled="loader ? true : undefined"
                @click.prevent="UpdateCart(quantity + 1)"
            ></a>
        </div>

        <div style="flex: 1" class="d-flex justify-content-center">
            <Spinner v-if="loader" />
            <span v-else>
                {{ quantity }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Spinner from "./Spinner.vue";
import { API } from "@/utils/api.js";

const props = defineProps({
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
    rowId: {
        type: String,
        default: "",
        required: true,
    },
    maxQty: {
        type: Number,
        default: 1,
        required: true,
    },
});

const emit = defineEmits(["refresh-cart"]);

const loader = ref(false);

async function UpdateCart(updateQty) {
    if (updateQty > props.maxQty || updateQty < 1) return;
    loader.value = true;
    try {
        const { data } = await API.post("update-cart-item", {
            rowId: props.rowId,
            qty: updateQty,
        });

        emit("refresh-cart", data);
    } catch (error) {
        console.log("error update cart item qty!");
    } finally {
        loader.value = false;
    }
}
</script>
