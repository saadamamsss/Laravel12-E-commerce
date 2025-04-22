<template>
    <div class="cart-drawer" :class="{ 'cart-drawer--open': DRAWER.isOpen }">
        <div class="cart-drawer__overlay" @click="DRAWER.toggleDrawer()"></div>

        <div class="cart-drawer__content">
            <div class="cart-drawer__header">
                <h2 class="cart-drawer__title">Your Cart</h2>
                <button class="cart-drawer__close" @click="DRAWER.toggleDrawer()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="cart-drawer__body" v-if="DRAWER.drawerContent">
                <!-- {{ DRAWER.drawerContent }} -->
                <div class="product-gallery">
                    <ul>
                        <li v-for="(
img, index
                            ) in DRAWER.drawerContent.images.split(',')" :key="index">
                            <img :src="`/assets/images/products/${img}`" alt="product images" />
                        </li>
                    </ul>
                </div>
                <br />
                <div>
                    <h3 class="font-medium mb-3">{{ DRAWER.drawerContent.name }}</h3>
                    <h4 class="font-bold">${{ DRAWER.drawerContent.price }}</h4>
                </div>

                <!--  -->
                <div v-if="DRAWER.drawerContent.variants?.length">
                    <VariantView :variants="DRAWER.drawerContent.variants"
                        :variantType="DRAWER.drawerContent.variantType" :productId="DRAWER.drawerContent.id" />
                </div>
                <div v-else class="mt-4 mb-2">
                    <AddToCartButton :productId="DRAWER.drawerContent.id" :drawer="false" />
                </div>

                <!--  -->
                <a :href="`/products/${DRAWER.drawerContent.slug}`"
                    class="text-gray-700 underline text-base hover:text-gray-100">view more details</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDrawerStore } from "@/stores/DrawerState.js";
import VariantView from "./VariantView.vue";
import AddToCartButton from "./AddToCartButton.vue";

const DRAWER = useDrawerStore();
</script>

<style scoped>
.cart-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
    transition: all 0.3s ease;
}

.cart-drawer--open {
    pointer-events: auto;
}

.cart-drawer__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.cart-drawer--open .cart-drawer__overlay {
    opacity: 1;
}

.cart-drawer__content {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 420px;
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.cart-drawer--open .cart-drawer__content {
    transform: translateX(0);
}

.cart-drawer__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
}

.cart-drawer__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.cart-drawer__close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #666;
    transition: color 0.2s ease;
}

.cart-drawer__close:hover {
    color: #333;
}

.cart-drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.cart-drawer__body::-webkit-scrollbar {
    display: none;
}

.product-gallery ul {
    position: relative;
    padding: 0px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    list-style: none;
    border: solid 1px #ddd;
    aspect-ratio: 1/1;
}

.product-gallery ul::-webkit-scrollbar {
    display: none;
}

.product-gallery ul li {
    overflow-y: hidden;
    width: 100%;
    min-width: 100%;
}

.product-gallery ul figure,
.product-gallery ul figure img {
    width: 100%;
    height: 100%;
}

@media (max-width: 480px) {
    .cart-drawer__content {
        max-width: 100%;
    }
}
</style>
