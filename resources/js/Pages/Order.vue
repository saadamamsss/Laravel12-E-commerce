<template>

    <AuthenticatedLayout>
        <!-- Orders Content -->

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex-1">
                    <label for="search" class="sr-only">Search orders</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input id="search" v-model="searchQuery" type="text" placeholder="Search orders..."
                            class="pl-10 block w-full pr-3 py-2 border border-[#e6e3de] rounded-md shadow-sm placeholder-[#444444]/40 focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <select v-model="statusFilter"
                        class="block w-full pl-3 pr-10 py-2 text-base border border-[#e6e3de] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                        <option value="all">All Statuses</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Orders List -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Table Header -->
            <div
                class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f8f8] border-b border-[#e6e3de] text-sm font-medium text-[#444444]/80">
                <div class="col-span-3">Order</div>
                <div class="col-span-3">Date</div>
                <div class="col-span-2">Total</div>
                <div class="col-span-2">Status</div>
                <div class="col-span-2">Actions</div>
            </div>

            <!-- Order Items -->
            <div class="divide-y divide-[#e6e3de]">
                <div v-for="order in filteredOrders" :key="order.id"
                    class="p-6 hover:bg-[#f8f8f8] transition-colors duration-150">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <!-- Order Number (Mobile) -->
                        <div class="md:hidden flex justify-between items-center">
                            <span class="text-sm text-[#444444]/60">Order</span>
                            <span class="font-medium text-[#444444]">#{{ order.id }}</span>
                        </div>
                        <!-- Order Number (Desktop) -->
                        <div class="hidden md:block col-span-3">
                            <p class="mb-0 font-medium text-[#444444]">#{{ order.id }}</p>
                            <p class="mb-0 text-sm text-[#444444]/60 mt-1">{{ order.items_count }} items</p>
                        </div>

                        <!-- Date -->
                        <div class="md:col-span-3">
                            <div class="md:hidden flex justify-between items-center ">
                                <span class="text-sm text-[#444444]/60">Date</span>
                                <span class="text-[#444444]">{{ new Date(order.created_at).toDateString() }}</span>
                            </div>
                            <div class="hidden md:block">
                                <p class="mb-0 text-[#444444]">{{ new Date(order.created_at).toDateString() }}</p>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="md:col-span-2">
                            <div class="md:hidden flex items-center ">
                                <span class="text-sm text-[#444444]/60">Total</span>
                                <span class="font-medium text-[#444444]">{{ order.total }}</span>
                            </div>
                            <div class="hidden md:block md:text-left">
                                <p class="mb-0 font-medium text-[#444444]">{{ order.total }}</p>
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="md:col-span-2">
                            <div class="flex justify-end md:justify-start">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                    :class="statusClasses(order.status)">
                                    {{ order.status }}
                                </span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="md:col-span-2">
                            <div class="flex">
                                <Link :href="`orders/${order.id}`"
                                    class="text-nowrap text-sm font-medium text-[#fff] bg-[#ff2832]/90 px-3 py-2 rounded-md cursor-pointer hover:bg-[#ff2832]/80  transition-colors duration-200 flex items-center">
                                View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-[#e6e3de] flex items-center justify-between">
                <div class="sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="mb-0 text-sm text-[#444444]">
                            Showing <span class="font-medium">{{ paginate.current_page }}</span>
                            to
                            <span class="font-medium">{{ paginate.links.length - 2 }}</span> of
                            <span class="font-medium">{{ paginate.total }}</span> results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">

                            <button v-for="(link, index) in paginate.links" :key="index"
                                @click="paginateOrders(link.url)" :aria-current="link.active ? 'page' : undefined"
                                class="relative inline-flex items-center px-4 py-2 border border-[#e6e3de] bg-white text-sm font-medium"
                                :class="link.active ?
                                    'z-10 bg-[#ddd] border-[#ff2832]/50 text-[#ff2832]' :
                                    'text-[#444444] hover:bg-[#e6e3de]/30'
                                    " v-html="link.label">

                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>


    </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { Link } from '@inertiajs/vue3';
import { API } from '@/utils/api';

// Sample orders data - replace with your actual data
const props = defineProps(['orders']);
const orders = ref(props.orders.data);
const paginate = ref({ ...props.orders, data: undefined });

const paginateOrders = async (url) => {
    const b = new URL(url);

    try {
        const { data } = await API.get("get-orders", { params: { page: b.searchParams.get("page") } });
        orders.value = data.data;
        paginate.value = { ...data, data: undefined };
    } catch (error) {

    }
}


// Filters
const searchQuery = ref('')
const statusFilter = ref('all')

// Computed properties
const filteredOrders = computed(() => {
    let result = orders.value

    // Apply status filter
    if (statusFilter.value !== 'all') {
        result = result.filter(order => order.status === statusFilter.value)
    }

    // Apply search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order =>
            order.id.toLowerCase().includes(query) ||
            order.items?.some(item => item.name.toLowerCase().includes(query)))
    }

    return result
})

// Methods
const statusClasses = (status) => {
    return {
        'bg-green-100 text-green-800': status === 'delivered',
        'bg-yellow-100 text-yellow-800': status === 'pending',
        'bg-blue-100 text-blue-800': status === 'shipped',
        'bg-red-100 text-red-800': status === 'cancelled'
    }
}

</script>

<style scoped>
/* Smooth transitions */
button,
.hover-effect {
    transition: all 0.2s ease;
}

/* Focus styles */
button:focus,
select:focus,
input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 40, 50, 0.2);
}
</style>