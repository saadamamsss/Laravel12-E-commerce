<template>
    <div class="wrap-show-advance-info-box style-1">
        <h3 class="title-box">Product Categories</h3>

        <div class="wrap-products">
            <div class="wrap-product-tab tab-style-1">
                <div class="tab-control">
                    <a v-for="(item, index) in categories" :key="index" :href="`#${item.slug}`" :class="[
                        'tab-control-item',
                        index === 0 ? 'active' : '',
                    ]">{{ item.name }}</a>
                </div>
                <div class="tab-contents">
                    <div v-for="(category, index) in categories" :key="index" :class="[
                        'tab-content-item',
                        index === 0 ? 'active' : '',
                    ]" :id="category.slug">
                        <div class="wrap-products slide-carousel owl-carousel style-nav-1 equal-container flex-slider"
                            data-items="5" data-loop="false" data-nav="true" data-dots="false"
                            data-responsive='{"0":{"items":"1"},"480":{"items":"2"},"768":{"items":"3"},"992":{"items":"4"},"1200":{"items":"5"}}'>
                            <div class="product product-style-2 equal-elem slides"
                                v-for="(item, index) in category.products" :key="index">
                                <div class="product-thumnail prod-img-ratio">
                                    <a :href="`/products/${item.slug}`" :title="item.name">
                                        <ImageComponent :source="`/assets/images/products/${item.images.split(',')[0]
                                            }`" :alt="item.name" />
                                    </a>

                                    <div class="wrap-btn">
                                        <a :href="`/products/${item.slug}`" class="function-link">quick view</a>
                                    </div>
                                </div>
                                <div class="product-info">
                                    <a :href="`/products/${item.slug}`" class="product-name d-block">
                                        <span>{{ item.name }}</span>
                                    </a>
                                    <div class="wrap-price">
                                        <span class="product-price">${{ item.price }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ProductSectionView from "./ProductSectionView.vue";
import ImageComponent from "./ImageComponent.vue";
import { onMounted, ref } from "vue";
import { API } from "@/utils/api.js";
import { mercado_innit_carousel, mercado_tabs } from "../utils/functions";

const props = defineProps({
    content: {
        type: Object,
        required: true,
    },
});

const categories = ref([]);


async function getProducts() {
    try {
    
        const { data } = await API.get("product-categories", {
            params: {
                categories: props.content.categories.join("--"),
                limit: props.content.limit,
            },
        });

        categories.value = data;

    } catch (error) {
        console.error("Failed to load products", error);
        // if faild to fest products try to fetch again;
        getProducts();

    }
}

getProducts();

</script>
