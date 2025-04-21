<template>
    <DefaultLayout>
        <!-- Main Content -->
        <main class=" mx-auto px-4 py-8 sm:px-6 lg:px-8" id="pageContent">
            <div class="container">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Sidebar Navigation -->
                    <div class="lg:col-span-1 px-0">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden" id="side-nav">
                            <nav class="space-y-1 p-4">
                                <Link v-for="item in navItems" :key="item.name" :href="item.href"
                                    class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
                                    :class="pagePathname.startsWith(item.href) ?
                                        'bg-[#ff2832]/10 text-[#ff2832]' :
                                        'text-[#444444] hover:bg-[#e6e3de]/30'
                                        ">
                                <component :is="item.icon" class="h-5 w-5 mr-3" />
                                {{ item.name }}
                                </Link>
                            </nav>
                        </div>

                    </div>

                    <!-- Dashboard Content -->
                    <div class="lg:col-span-3 space-y-6 px-0">
                        <slot />
                    </div>

                </div>
            </div>

        </main>

    </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import {
    HomeIcon,
    ShoppingBagIcon,
    MapPinIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'
import { Link, usePage } from '@inertiajs/vue3'
import DefaultLayout from './DefaultLayout.vue';

const { url: pagePathname } = usePage();

// Navigation items
const navItems = ref([
    { name: 'Dashboard', href: '/account/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/account/profile', icon: MapPinIcon },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
    { name: 'Addresses', href: '/account/address', icon: MapPinIcon },
    { name: 'Payment Methods', href: '/account/payments', icon: CreditCardIcon },
    { name: 'Help Center', href: '/help', icon: QuestionMarkCircleIcon }
])

</script>

<style scoped>
#pageContent {
    background-color: #f0f0f0c7;
}

#side-nav {
    position: sticky;
    top: 60px;
}
</style>
