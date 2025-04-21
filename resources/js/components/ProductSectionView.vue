<template>
    <div class="wrap-show-advance-info-box style-1" :class="{ 'has-countdown': countdown }">
        <div class="wrap-show-advance-info-box style-1 position-relative" v-if="products.length">
            <h3 class="title-box" v-if="title">{{ title }}</h3>

            <div v-if="countdown" class="wrap-countdown relative mercado-countdown" :data-expire="countdown"></div>
            <div v-else class="row mx-0 py-2"></div>

            <div class="wrap-products pt-0">
                <div class="wrap-product-tab tab-style-1 mt-0">
                    <div class="tab-contents">
                        <div class="tab-content-item active" id="digital_1a">
                            <div class="wrap-products slide-carousel owl-carousel style-nav-1 equal-container flex-slider"
                                data-items="5" data-loop="false" data-nav="true" data-dots="false"
                                data-responsive='{"0":{"items":"1"},"480":{"items":"2"},"768":{"items":"3"},"992":{"items":"4"},"1200":{"items":"5"}}'>
                                <div class="product product-style-2 equal-elem slides" v-for="(item, index) in products"
                                    :key="index">
                                    <div class="product-thumnail prod-img-ratio">
                                        <a :href="`/products/${item.slug}`" :title="item.name">
                                            <ImageComponent :source="`/assets/images/products/${item.images.split(',')[0]
                                                }`" :alt="item.name" />
                                        </a>
                                        <div class="group-flash"></div>
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
    </div>
</template>
<script>
import ImageComponent from "./ImageComponent.vue";
export default {
    name: "ProductSection",
    components: { ImageComponent },
    props: {
        title: {
            type: String,
            default: null,
        },
        products: {
            type: Array,
            required: true,
        },
        countdown: {
            type: String,
            default: null,
        },
        saleActive: {
            type: Boolean,
            default: false,
        },
        showNewLabel: {
            type: Boolean,
            default: false,
        },
    },

    methods: {},
};
</script>
