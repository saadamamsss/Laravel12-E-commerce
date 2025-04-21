<!--
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2
                class="text-xl font-semibold leading-tight text-gray-800"
            >
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                    class="overflow-hidden bg-white shadow-sm sm:rounded-lg"
                >
                    <div class="p-6 text-gray-900">
                        You're logged in!
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
-->


<template>

    <AuthenticatedLayout>
        <div class="bg-gradient-to-r from-[#ff2832]/10 to-[#e6e3de]/20 rounded-xl p-6 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-xl font-bold text-[#444444]">
                        Welcome back, {{ $page.props.auth.user.name }}!
                    </h2>
                    <p class="text-[#444444]/80 mt-1">
                        <!-- You have {{ user.ordersInProgress }} notifications no readed -->
                    </p>
                </div>
                <Link href="/shop"
                    class="mt-4 md:mt-0 bg-[#ff2832] hover:bg-[#ff2832]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
                Start Shopping
                </Link>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm text-[#444444]/60">Recent Orders</p>
                        <p class="text-xl font-semibold text-[#444444]">{{ stats.recentOrders }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm text-[#444444]/60">Wishlist Items</p>
                        <p class="text-xl font-semibold text-[#444444]">{{ stats.wishlistItems }}</p>
                    </div>
                </div>
            </div>

        </div>



        <!-- Recommended Products -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-[#e6e3de]">
                <h3 class="text-lg font-medium text-[#444444]">Recommended For You</h3>
            </div>
            <div class="grid grid-cols-3 gap-6 p-6">
                <div v-for="product in recommendedProducts" :key="product.id" class="group">
                    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-[#e6e3de]/30">
                        <Link :href="`/products/${product.slug}`">
                        <img :src="`/assets/images/products/${product.images?.split(',')[0]}`" :alt="product.name"
                            class="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200">
                        </Link>

                    </div>
                    <div class="mt-2">
                        <Link :href="`/products/${product.slug}`">
                        <p class="text-sm text-[#444444]/80">{{ product.category?.name ?? '_' }}</p>
                        </Link>
                        <h4
                            class="font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200">
                            {{ product.name }}</h4>
                        <p class="text-[#ff2832] text-lg font-bold mt-1">${{ product.price }}</p>
                    </div>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>

</template>

<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { useGloabalState } from '@/stores/Global';
import { API } from '@/utils/api';
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'

const globals = useGloabalState();

const props = defineProps(['recentOrders']);


const recommendedProducts = ref(globals.recommendedProducts ?? []);

async function getrecommendedProducts() {
    if (recommendedProducts.value?.length) return;

    try {
        const { data } = await API.get("recommended-products");
        recommendedProducts.value = data;
        globals.setRecommendedProducts(data);
    } catch (error) {
        console.log("faild to get recommended products!");

        getrecommendedProducts();

    }
}
getrecommendedProducts();

// Quick stats
const stats = ref({
    recentOrders: props.recentOrders,
    wishlistItems: 8,
})

</script>
