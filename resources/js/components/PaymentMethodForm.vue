<template>

    <Modal :show="props.isOpen" max-width="lg">

        <!-- Modal -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-[#444444] mb-4">
                {{ paymentMethod?.id ? 'Edit Payment Method' : 'Add Payment Method' }}
            </h3>

            {{ paymentMethod?.id }}
            <!-- Payment Method Form -->
            <div class="space-y-4">
                <!-- Card Element (for Stripe or other payment processors) -->
                <div class="flex items-center gap-2">
                    <input type="radio" id="card-payment" v-model="formData.type" value="card" />
                    <label for="card-payment" class="mb-0">Credit Card</label>
                </div>

                <div id="card-element" class="border border-[#e6e3de] rounded-md p-3" v-if="formData.type === 'card'">
                    <div class="grid grid-cols-2 gap-3">
                        <TextInput class="w-full mb-2 border-1 border-gray-300 " v-model="formData.last4"
                            placeholder="Card Number" />
                        <select class="w-full mb-2 border-1 border-gray-300 " v-model="formData.brand">
                            <option value="visa">visa</option>
                            <option value="master-card">master card</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <TextInput class="w-full mb-2 border-1 border-gray-300 " v-model="formData.exp_month"
                            placeholder="Exp Month" />
                        <TextInput class="w-full mb-2 border-1 border-gray-300 " v-model="formData.exp_year"
                            placeholder="Exp Year" />
                    </div>

                </div>

                <!-- Or PayPal Button -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-[#e6e3de]"></div>
                    </div>

                    <div class="relative flex justify-center">
                        <span class="px-2 bg-white text-sm text-[#444444]/60">Or</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input type="radio" id="paypal-payment" v-model="formData.type" value="paypal" />
                    <label for="paypal-payment" class="mb-0">PayPal</label>
                </div>
                <div class="flex" v-if="formData.type === 'paypal'">
                    <div class="relative">
                        <span class="absolute left-0 top-0 block mx-0 my-0">
                            <svg class=" h-5 w-5 mr-2 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm15.147-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.032.175-.056.306-.23 1.888-.892 6.12-1.003 6.85L19.4 15.829l1.61-9.912zm-1.127-3.562c-.202-1.207-.713-2.03-1.608-2.73-.899-.7-2.146-1.15-3.725-1.15h-7.46a.641.641 0 0 0-.633.74l2.108 13.365a.873.873 0 0 0 .862.74h2.98c4.226 0 7.48-1.402 8.742-5.8.452-1.848.528-3.462.252-4.735a4.615 4.615 0 0 0-.518-1.43z" />
                            </svg>
                        </span>
                        <TextInput class="w-full mb-2 border-1 border-gray-300 " v-model="formData.email"
                            placeholder="Add PayPal Account" />

                    </div>
                </div>

                <!-- Set as Default -->
                <div class="flex items-center">
                    <input id="default" v-model="formData.is_default" type="checkbox"
                        class="h-4 w-4 mt-0 text-[#ff2832] border-[#e6e3de] rounded focus:ring-[#ff2832]/50">
                    <label for="default" class="ml-2 mb-0 block text-sm text-[#444444]">
                        Set as default payment method
                    </label>
                </div>
            </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-[#e6e3de]/30 px-4 py-3 sm:px-6 sm:flex  space-x-4">
            <button type="button" @click="submitForm"
                class="flex-1 bg-[#ff2832] text-[#fff] py-3 hover:bg-[#ff2832]/90  transition-all duration-200"
                :disabled="isSubmitting">
                {{ isSubmitting ? 'Processing...' : 'Save Payment Method' }}
            </button>
            <button type="button" @click="closeForm"
                class="flex-1 border border-[#e6e3de]  text-[#444444] hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200">
                Cancel
            </button>
        </div>


    </Modal>

</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import TextInput from './TextInput.vue'
import Modal from './Modal.vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: Object,
        default: null
    },
    isSubmitting: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['submit', 'cancel']);

const formData = reactive({ type: "card" });

watch(() => formData.type, (newVal) => {
    if (formData.type === "card") {
        Object.assign(formData, {
            type: 'card',
            last4: '',
            brand: '',
            exp_month: "",
            exp_year: "",
            is_default: false
        });
    } else {
        Object.assign(formData, {
            type: 'paypal',
            email: props.paymentMethod?.email ?? '',
            is_default: false
        })
    }
}, { deep: true });


watch(() => props.paymentMethod, (newVal) => {

    Object.assign(formData, JSON.parse(JSON.stringify(newVal)));

}, { deep: true, immediate: true });

const submitForm = () => {
    emit('submit', formData)
}

const closeForm = () => {
    emit('cancel')
}
</script>