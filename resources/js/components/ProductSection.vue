<template>

    <ProductSectionView v-if="products.length" :countdown="props.content.countdown" :title="props.content.title"
        :products="products" />

</template>

<script setup>
import ProductSectionView from "./ProductSectionView.vue";
import { ref } from "vue";
import { API } from "@/utils/api.js";

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});

const products = ref([]);
async function getProducts() {
    try {

        const { data } = await API.get("product-collection", {
            params: {
                collectionID: props.content.collectionId
            }
        })
        products.value = data;

    } catch (error) {
        console.error("Failed to load products", error);
        // if faild to fetch try again
        getProducts();
    }
}
getProducts();

</script>
