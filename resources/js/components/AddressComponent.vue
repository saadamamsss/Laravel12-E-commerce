<template>
    <div class="border border-[#e6e3de] rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        :class="{ 'border-[#ff2832]': isDefault, 'cursor-pointer': selectable }"
        @click="selectable ? $emit('selected', address.id) : null">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-medium text-[#444444]">{{ address.name }}</h3>
                <p class="text-sm text-[#444444]/80 mt-1">{{ address.phone }}</p>
            </div>

            <div class="flex space-x-2">
                <!-- Default Badge -->
                <span v-if="isDefault"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]">
                    Default
                </span>

                <!-- Edit Button -->
                <button @click.stop="$emit('edit', address.id)"
                    class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>

                <!-- Delete Button -->
                <button @click.stop="$emit('delete', address.id)"
                    class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="mt-4 text-sm text-[#444444]">
            <p>{{ address.address_1 }}</p>
            <p v-if="address.address_2">{{ address.address_2 }}</p>
            <p>{{ address.city }}, {{ address.province }} {{ address.zipCode }}</p>
            <p>{{ address.country }}</p>
        </div>

        <!-- Set Default Button -->
        <div v-if="!isDefault" class="mt-4">
            <button @click.stop="$emit('set-default', address.id)"
                class="text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                Set as default
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    address: {
        type: Object,
        required: true,
        default: () => ({
            id: '',
            name: '',
            phone: '',
            address_1: '',
            address_2: '',
            city: '',
            province: '',
            zipCode: '',
            country: '',
            is_default: false
        })
    },
    selectable: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['edit', 'delete', 'set-default', 'selected']);

const isDefault = computed(() => props.address.is_default)
</script>

<style scoped>
/* Smooth transitions */
button,
div {
    transition: all 0.2s ease;
}
</style>