import { defineStore } from "pinia";
import { ref } from "vue";

export const useGloabalState = defineStore("GLOBAL", () => {
    // State
    const recommendedProducts = ref([]);
    function setRecommendedProducts(data) {
        recommendedProducts.value = data;
    }

    return {
        recommendedProducts,
        setRecommendedProducts,
    };
});
