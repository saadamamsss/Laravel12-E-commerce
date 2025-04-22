<template>
    <!--main area-->
    <DefaultLayout>
        <main id="main" class="main-site left-sidebar">
            <div class="container">
                <div class="wrap-breadcrumb">
                    <ul>
                        <li class="item-link">
                            <Link href="/" class="link">home</Link>
                        </li>
                        <li class="item-link"><span>Shop</span></li>
                    </ul>
                </div>

                <div class="row">
                    <!-- Filter section -->
                    <FilterSection :categories="props.categories" :brands="props.brands" @refetch="refetchProducts" />

                    <!--  -->
                    <!--  -->
                    <div class="col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area">
                        <div class="wrap-shop-control">
                            <h1 class="shop-title">Shop</h1>

                            <div class="wrap-right">
                                <div class="sort-item product-per-page">
                                    <select name="post-per-page" class="border rounded-md h-8 py-0">
                                        <option value="15" selected="selected">
                                            15 per page
                                        </option>
                                        <option value="16">18 per page</option>
                                        <option value="18">21 per page</option>
                                        <option value="21">24 per page</option>
                                        <option value="24">27 per page</option>
                                        <option value="30">30 per page</option>
                                        <option value="32">33 per page</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!--end wrap shop control-->
                        <div class="row">
                            <div v-for="product in products" :key="product.id"
                                class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                <div class="product product-style-3 equal-elem">
                                    <div class="product-thumnail prod-img-ratio">
                                        <Link :href="`/products/${product.slug}`"
                                            title="T-Shirt Raw Hem Organic Boro Constrast Denim">
                                        <ImageComponent :source="`/assets/images/products/${product.images.split(',')[0]
                                            }`" alt="product thumbnail" />
                                        </Link>
                                    </div>
                                    <div class="product-info">
                                        <Link :href="`/products/${product.slug}`" class="product-name">
                                        <span>{{ product.name }}</span>
                                        </Link>
                                        <div class="wrap-price">
                                            <span class="product-price">${{ product.price }}</span>
                                        </div>

                                        <AddToCartButton :productId="product.id" />
                                    </div>
                                </div>
                            </div>


                            <ProductSkelton :count="3" v-if="pageLoading" />

                        </div>

                        <div class="row mx-0 py-3" v-if="!products.length && !pageLoading">
                            <div class="col-12 px-2">
                                <h2 class="mb-3">No products match your filters</h2>
                                <p>Try adjusting your search criteria or
                                    <Link :href="locationURL.split('?')[0]">clear all filters</Link>
                                </p>
                            </div>
                        </div>

                        <div class="wrap-pagination-info" v-if="products.length">
                            <ul class="page-numbers">
                                <li v-for="(link, index) in pagination.links" :key="index">
                                    <button v-if="link.active" class="page-number-item current"
                                        @click="pginationClick(link.url)" v-html="link.label"></button>
                                    <!--  -->
                                    <button v-else class="page-number-item" @click="pginationClick(link.url)"
                                        v-html="link.label"></button>
                                </li>
                            </ul>

                            <p class="result-count">
                                Showing 1-{{ pagination.per_page }} of
                                {{ pagination.total }} result
                            </p>
                        </div>
                    </div>
                    <!--end main products area-->

                </div>

                <!--end row-->
            </div>
            <!--end container-->
            <AddToCartDrawer />
        </main>
    </DefaultLayout>

    <!--main area-->
</template>

<script setup>
import { ref, computed } from "vue";

import AddToCartButton from "@/components/AddToCartButton.vue";
import FilterSection from "@/components/FilterSection.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import AddToCartDrawer from "@/components/AddToCartDrawer.vue";
import { API } from "@/utils/api.js";
import { Link, usePage } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import ProductSkelton from "@/components/ProductSkelton.vue";

const props = defineProps(['brands', "categories", 'pageType']);

const { url: locationURL } = usePage();

const pageLoading = ref(true);
const products = ref([]);
const pagination = ref({});

const url_search = computed(() => {
    return locationURL.split("?")[1];
});

const Getproducts = async (url) => {

    try {

        const { data } = await API.get(url);
        products.value = data.data;
        pagination.value = { ...data, data: undefined };


    } catch (error) {
        console.log("faild to get shop products!");
    } finally {
        pageLoading.value = false;
    }
};

const routeParam = computed(() => {
    const pathname = locationURL.split("?")[0];
    return `shop-products/${props.pageType + pathname}`;
});

function initGettingProducts() {
    const params = new URLSearchParams(url_search.value);
    const search = params.toString();
    Getproducts(search ? `${routeParam.value}?${search}` : routeParam.value);
}
initGettingProducts();

const pginationClick = (url) => {
    Getproducts(url);
    window.scrollTo({ top: 140, behavior: "smooth" });
};

const refetchProducts = (search) => {
    Getproducts(routeParam.value + '?' + search);
    window.scrollTo({ top: 140, behavior: "smooth" });
};

</script>
