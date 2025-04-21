<template>
    <div class="border border-[#e6e3de] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative"
        :class="{ 'border-[#ff2832]': isDefault }">
        <div class="flex items-start justify-between">
            <!-- Card Info -->
            <div class="flex items-center">
                <!-- Card Brand Icon -->
                <div class="flex-shrink-0">
                    <div v-if="paymentMethod.type === 'card'"
                        class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                            stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                        </svg>

                    </div>
                    <div v-else-if="paymentMethod.type === 'paypal'"
                        class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center">
                        <svg class="h-6 w-6 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm15.147-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.032.175-.056.306-.23 1.888-.892 6.12-1.003 6.85L19.4 15.829l1.61-9.912zm-1.127-3.562c-.202-1.207-.713-2.03-1.608-2.73-.899-.7-2.146-1.15-3.725-1.15h-7.46a.641.641 0 0 0-.633.74l2.108 13.365a.873.873 0 0 0 .862.74h2.98c4.226 0 7.48-1.402 8.742-5.8.452-1.848.528-3.462.252-4.735a4.615 4.615 0 0 0-.518-1.43z" />
                        </svg>
                    </div>
                </div>

                <!-- Card Details -->
                <div class="ml-4">
                    <h4 class="text-sm font-medium text-[#444444]">
                        <span v-if="paymentMethod.type === 'card'">
                            {{ paymentMethod.brand.toUpperCase() }} ending in {{ paymentMethod.last4 }}
                        </span>
                        <span v-else-if="paymentMethod.type === 'paypal'">
                            PayPal ({{ paymentMethod.email }})
                        </span>
                    </h4>
                    <p v-if="paymentMethod.type === 'card'" class="text-sm text-[#444444]/60 mt-1">
                        Expires {{ paymentMethod.exp_month }}/{{ paymentMethod.exp_year.toString().slice(-2) }}
                    </p>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
                <div v-if="isDefault">
                    <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]">
                        Default
                    </span>
                </div>
                <button @click.stop="$emit('edit', paymentMethod)"
                    class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
            </div>

        </div>
        <div class="default-badge absolute">
            <button v-if="!isDefault" @click.stop="$emit('set-default', paymentMethod.id)"
                class="text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                Set Default
            </button>
          
        </div>
    </div>
</template>

<script setup>

defineProps({
    paymentMethod: {
        type: Object,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
})

defineEmits(['set-default', 'edit', 'delete'])
</script>
<style scoped>
.default-badge{
    bottom: 10px;
    right: 35px;
}
</style>