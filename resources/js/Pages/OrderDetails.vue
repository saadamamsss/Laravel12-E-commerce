<template>
    <AuthenticatedLayout>

        <!-- Status Alert -->
        <div class="rounded-md bg-[#ff2832]/10 p-4" v-if="order.status !== 'delivered'">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#ff2832]" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm my-0 font-medium text-[#ff2832]">
                        {{ statusMessages[order.status]?.title || 'Order Processing' }}
                    </h3>
                    <div class="mt-2 text-sm text-[#ff2832]/80">
                        <p>
                            {{ statusMessages[order.status]?.message || 'Your order is being processed' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-[#e6e3de]">
                <h2 class="text-lg font-medium text-[#444444]">Order Summary</h2>
            </div>

            <!-- Order Items -->
            <div class="divide-y divide-[#e6e3de]">
                <div v-for="item in order.items" :key="item.id" class="p-6">
                    <div class="flex flex-col sm:flex-row gap-2">
                        <!-- Product Image -->
                        <div class="flex-shrink-0">
                            <img :src="getImage(item)" :alt="item.product.name"
                                class="w-20 h-20 rounded-md object-cover">
                        </div>

                        <!-- Product Details -->
                        <div class="sm:mt-0 sm:ml-6 flex-1">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h4 class="text-sm font-medium text-[#444444]">
                                        {{ item.product.name }}
                                    </h4>
                                    <p v-if="item.variant" class="mt-1 text-sm text-[#444444]/60">
                                        <span v-for="([attr, value]) in variantAttributes(item.variant)"
                                            class="d-block">
                                            <strong>{{ attr }}</strong>: {{ value }}
                                        </span>
                                    </p>
                                </div>
                                <p class="text-sm font-medium text-[#444444] ml-4">
                                    {{ formatCurrency(item.price) }}
                                </p>
                            </div>

                            <div class="mt-2 flex items-center justify-between">
                                <p class="text-sm text-[#444444]/60">
                                    Qty: {{ item.qty }}
                                </p>
                                <p class="text-sm font-medium text-[#444444]">
                                    {{ formatCurrency(item.price * item.qty) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Totals -->
            <div class="p-6 border-t border-[#e6e3de]">
                <div class="space-y-4">
                    <div class="flex justify-between text-sm text-[#444444]">
                        <span>Subtotal</span>
                        <span>{{ formatCurrency(order.subTotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-[#444444]">
                        <span>Shipping</span>
                        <span>{{ formatCurrency(order.shipCost) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-[#444444]">
                        <span>Tax</span>
                        <span>{{ formatCurrency(order.tax) }}</span>
                    </div>
                    <div
                        class="flex justify-between text-base font-medium text-[#444444] pt-2 border-t border-[#e6e3de] mt-2">
                        <span>Total</span>
                        <span>{{ formatCurrency(order.total) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Shipping & Payment Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Shipping Address -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-6 border-b border-[#e6e3de]">
                    <h2 class="text-lg font-medium text-[#444444]">Shipping Information</h2>
                </div>
                <div class="p-6">
                    <div class="text-sm text-[#444444] space-y-2" v-if="order.shipping">
                        <p class="font-medium">{{ order.shipping.name }}</p>
                        <p>{{ order.shipping.address_1 }}</p>
                        <p v-if="order.shipping.address_2">{{ order.shipping.address_2 }}</p>
                        <p>{{ order.shipping.city }}, {{ order.shipping.state }} {{ order.shipping.zip }}
                        </p>
                        <p>{{ order.shipping.country }}</p>
                        <p class="mt-4">{{ order.shipping.phone }}</p>
                    </div>

                    <div class="text-sm text-[#444444] space-y-2" v-else>
                        <p class="font-medium">{{ order.name }}</p>
                        <p>{{ order.address_1 }}</p>
                        <p v-if="order.address_2">{{ order.address_2 }}</p>
                        <p>{{ order.city }}, {{ order.province }} {{ order.zipCode }}
                        </p>
                        <p>{{ order.country }}</p>
                        <p class="mt-4">{{ order.phone }}</p>
                    </div>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-6 border-b border-[#e6e3de]">
                    <h2 class="text-lg font-medium text-[#444444]">Payment Information</h2>
                </div>
                <div class="p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-sm font-medium text-[#444444]">
                                {{ ("credit").toUpperCase() }} ending in 24564
                            </h4>
                            <p class="text-sm text-[#444444]/60 mt-1">
                                Expires 11/28
                            </p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h3 class="text-sm font-medium text-[#444444]">Billing Address</h3>
                        <div class="text-sm text-[#444444] mt-1 space-y-1">
                            <p class="font-medium">{{ order.name }}</p>
                            <p>{{ order.address_1 }}</p>
                            <p v-if="order.address_2">{{ order.address_2 }}</p>
                            <p>{{ order.city }}, {{ order.province }} {{ order.zipCode }}
                            </p>
                            <p>{{ order.country }}</p>
                            <p class="mt-4">{{ order.phone }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Actions -->
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button v-if="order.status === 'delivered'" type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buy Again
            </button>
            <button v-if="order.status === 'delivered'" type="button"
                class="inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Help
            </button>
            <Link type="button"
                class="inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                :href="route('orders.index')">
            Back to Orders
            </Link>
        </div>

    </AuthenticatedLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {route} from "ziggy-js";
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { Link } from '@inertiajs/vue3';


const { order } = defineProps(['order']);
const billingData = ref(null);
onMounted(() => {
    console.log(billingData.value);

})
const statusMessages = {
    pending: {
        title: 'Order Processing',
        message: 'Your order is being prepared for shipment'
    },
    shipped: {
        title: 'Order Shipped',
        message: 'Your order is on the way'
    },
    delivered: {
        title: 'Order Delivered',
        message: 'Your order has been delivered'
    },
    cancelled: {
        title: 'Order Cancelled',
        message: 'Your order has been cancelled'
    }
}

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

const getImage = (item) => {
    const path = "/assets/images/products/";
    if (item.variant) {

        return path + item.variant.images.split(',')[0];
    }
    return path + item.product.images.split(',')[0];


}


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

const variantAttributes = (variant) => {

    const { id, images, SKU, ...rest } = variant;

    return Object.entries(rest);

}
</script>

<style scoped>
/* Smooth transitions */
button {
    transition: all 0.2s ease;
}
</style>