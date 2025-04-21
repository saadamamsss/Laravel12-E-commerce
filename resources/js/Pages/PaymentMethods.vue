<template>
    <AuthenticatedLayout>

        <!-- Add New Payment Method -->
        <button @click="showAddForm = true"
            class="w-full flex items-center justify-center p-6 border-2 border-dashed border-[#e6e3de] rounded-xl hover:border-[#ff2832]/50 transition-all duration-200 group">
            <div class="text-center">
                <div
                    class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#ff2832]/10 group-hover:bg-[#ff2832]/20 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#ff2832]" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3
                    class="mt-2 text-sm font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200">
                    Add Payment Method
                </h3>
            </div>
        </button>


        
        <!-- Payment Methods List -->
        <div class="space-y-4">
            <!-- Default Payment Method -->
            <div v-if="defaultPaymentMethod" class="relative">
                <PaymentMethodCard :payment-method="defaultPaymentMethod" :is-default="true"
                    @set-default="setDefaultPayment" @edit="editPaymentMethod" @delete="confirmDeletePayment" />
            </div>

            <!-- Other Payment Methods -->
            <div v-for="method in otherPaymentMethods" :key="method.id" class="relative">
                <PaymentMethodCard :payment-method="method" :is-default="false" @set-default="setDefaultPayment"
                    @edit="editPaymentMethod" @delete="confirmDeletePayment" />
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="paymentMethods.length === 0" class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-[#444444]/40" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-[#444444]">No payment methods</h3>
            <p class="mt-1 text-sm text-[#444444]/60">Add a payment method to make checkout faster</p>
            <div class="mt-6">
                <button @click="() => showAddForm = true" type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Payment Method
                </button>
            </div>
        </div>



        <PaymentMethodForm :isOpen="!!showAddForm || !!editingPaymentMethod" :payment-method="editingPaymentMethod"
            :is-submitting="isSubmitting" @submit="handleSubmit" @cancel="closeForm" />



    </AuthenticatedLayout>

</template>

<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { ref, computed } from 'vue'
import PaymentMethodCard from '@/components/PaymentMethodCard.vue'
import PaymentMethodForm from '@/components/PaymentMethodForm.vue'

// Sample data - replace with your actual data
const paymentMethods = ref([
    {
        id: 1,
        type: 'card',
        last4: '4242',
        brand: 'visa',
        exp_month: "12",
        exp_year: "2025",
        is_default: true
    },
    {
        id: 2,
        type: 'card',
        last4: '1881',
        brand: 'master-card',
        exp_month: "3",
        exp_year: "2024",
        is_default: false
    },
    {
        id: 3,
        type: 'paypal',
        email: 'user@example.com',
        is_default: false
    }
])

const showAddForm = ref(false)
const editingPaymentMethod = ref(null)
const isSubmitting = ref(false)

// Computed properties
const defaultPaymentMethod = computed(() =>
    paymentMethods.value.find(method => method.is_default)
)

const otherPaymentMethods = computed(() =>
    paymentMethods.value.filter(method => !method.is_default)
)

// Methods
const setDefaultPayment = (id) => {
    paymentMethods.value = paymentMethods.value.map(method => ({
        ...method,
        is_default: method.id === id
    }))
}

const editPaymentMethod = (method) => {
    editingPaymentMethod.value = method
}

const confirmDeletePayment = (id) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
        paymentMethods.value = paymentMethods.value.filter(method => method.id !== id)
    }
}

const handleSubmit = (formData) => {
    isSubmitting.value = true

    console.log(formData);

    // Simulate API call
    setTimeout(() => {
        if (formData.id) {
            // Update existing
            const index = paymentMethods.value.findIndex(m => m.id === formData.id)
            if (index !== -1) {
                paymentMethods.value[index] = JSON.parse(JSON.stringify(formData));
            }
        } else {
            // Add new
            paymentMethods.value.push({
                ...formData,
                id: Math.max(...paymentMethods.value.map(m => m.id), 0) + 1
            })

        }

        isSubmitting.value = false
        closeForm();
    }, 1000)
}

const closeForm = () => {
    showAddForm.value = false
    editingPaymentMethod.value = null
}
</script>

<style scoped>
/* Smooth transitions */
button,
.transition-all {
    transition: all 0.2s ease;
}
</style>