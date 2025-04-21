<template>
    <div class="delete">
        <Spinner v-if="loader" />

        <a
            v-else
            href="#"
            class="btn btn-delete"
            @click.prevent="DeleteitemCart()"
        >
            <span>Delete from your cart</span>
            <i class="fa fa-times-circle" aria-hidden="true"></i>
        </a>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Spinner from "./Spinner.vue";
import { API } from "@/utils/api.js";

const props = defineProps({
    rowId: {
        type: String,
        default: "",
        required: true,
    },
});

const emit = defineEmits(["refresh-cart"]);
const loader = ref(false);

async function DeleteitemCart() {
    loader.value = true;
    try {
        const { data } = await API.post("update-cart-item", {
            rowId: props.rowId,
            qty: 0,
        });

        emit("refresh-cart", data);
    } catch (error) {
        console.log("faild to delete cart item");
    } finally {
        loader.value = false;
    }
}
</script>
