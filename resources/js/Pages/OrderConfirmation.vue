<template>
    <DefaultLayout>

        <div class="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto">
                <!-- Success Card -->
                <div
                    class="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
                    <div class="p-8">
                        <div class="flex items-center justify-center mb-6">
                            <div class="rounded-full bg-[#ff2832]/10 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#ff2832]" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <h1 class="text-3xl font-bold text-center text-[#444444] mb-4">Order Confirmed!</h1>
                        <p class="text-center text-[#444444]/80 mb-6">
                            Thank you for your purchase. Your order <span class="font-semibold text-[#ff2832]">#{{
                                order.id }}</span> has been received and is being processed.
                        </p>

                        <div class="bg-[#e6e3de]/30 px-4 py-2 rounded-lg border border-[#e6e3de]">
                            <h3 class="font-medium text-[#444444] mb-4">Order Summary</h3>
                            <div class="mb-2 flex justify-between text-sm text-[#444444]/80">
                                <span>Date:</span>
                                <span>{{ new Date(order.created_at).toDateString() }}</span>
                            </div>
                            <div class="mb-2 flex justify-between text-sm text-[#444444]/80">
                                <span>Total:</span>
                                <span class="font-medium">${{ Number(order.total).toFixed(2) }}</span>
                            </div>
                            <div class="mb-3 flex justify-between text-sm text-[#444444]/80">
                                <span>Payment Status:</span>
                                <span>({{ order.paymentStatus }})</span>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- CTA Buttons -->
                <div class="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/account/orders"
                        class="flex-1 bg-[#444444] hover:bg-[#ddd]  text-white hover:text-black py-3 px-4  text-center font-medium transition-colors duration-200">
                    View All Orders
                    </Link>
                    <Link href="/shop"
                        class="flex-1 bg-white border border-[#e6e3de] hover:bg-[#ff2832] hover text-[#444444] hover:text-white py-3 px-4 text-center font-medium transition-colors duration-200 shadow-sm">
                    Continue Shopping
                    </Link>
                </div>
            </div>
        </div>

    </DefaultLayout>

</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Link } from '@inertiajs/vue3'
import { ref, computed, onMounted } from 'vue'
const props = defineProps(['order']);
// Sample order data - replace with your actual data
const order = ref(props.order);


</script>

<style scoped>
/* Smooth transitions */
.timeline-step {
    transition: all 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #e6e3de;
}

::-webkit-scrollbar-thumb {
    background: #ff2832;
    border-radius: 3px;
}
</style>