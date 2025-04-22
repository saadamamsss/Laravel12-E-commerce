<template>
    <div class="border-2 border-[#ff2832] rounded-lg p-6 bg-white shadow-md">
        <h3 class="text-lg font-medium text-[#444444] mb-4">
            {{ address?.id ? 'Edit Address' : 'Add New Address' }}
        </h3>

        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Full Name -->
                <div class="md:col-span-2">
                    <label for="name" class="block text-sm font-medium text-[#444444] mb-1">Full Name *</label>
                    <input id="name" v-model="formData.name" type="text" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- Phone Number -->
                <div>
                    <label for="phone" class="block text-sm font-medium text-[#444444] mb-1">Phone Number *</label>
                    <input id="phone" v-model="formData.phone" type="tel" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- address_1 Address 1 -->
                <div class="md:col-span-2">
                    <label for="address_1" class="block text-sm font-medium text-[#444444] mb-1">address_1 Address
                        *</label>
                    <input id="address_1" v-model="formData.address_1" type="text" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- address_1 Address 2 -->
                <div class="md:col-span-2">
                    <label for="address_2" class="block text-sm font-medium text-[#444444] mb-1">Apartment, Suite, etc.
                        (Optional)</label>
                    <input id="address_2" v-model="formData.address_2" type="text"
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- City -->
                <div>
                    <label for="city" class="block text-sm font-medium text-[#444444] mb-1">City *</label>
                    <input id="city" v-model="formData.city" type="text" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- province/Province -->
                <div>
                    <label for="province" class="block text-sm font-medium text-[#444444] mb-1">province/Province
                        *</label>
                    <input id="province" v-model="formData.province" type="text" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- zipCode/Postal Code -->
                <div>
                    <label for="zipCode" class="block text-sm font-medium text-[#444444] mb-1">zipCode/Postal Code
                        *</label>
                    <input id="zipCode" v-model="formData.zipCode" type="text" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                </div>

                <!-- Country -->
                <div>
                    <label for="country" class="block text-sm font-medium text-[#444444] mb-1">Country *</label>
                    <select id="country" v-model="formData.country" required
                        class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200">
                        <option value="">Select Country</option>
                        <option v-for="country in countries" :key="country" :value="country">
                            {{ country }}
                        </option>
                    </select>
                </div>

                <!-- Set as Default -->
                <div class="md:col-span-2 flex items-center">
                    <input id="default" v-model="formData.is_default" type="checkbox"
                        class="h-4 w-4 text-[#ff2832] border-[#e6e3de] rounded focus:ring-[#ff2832]/50">
                    <label for="default" class="ml-2 block text-sm text-[#444444]">
                        Set as default address
                    </label>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="$emit('cancel')"
                    class="px-4 py-2 border border-[#e6e3de] rounded-md shadow-sm text-sm font-medium text-[#444444] hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200">
                    Cancel
                </button>
                <button type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                    :disabled="formData.processing">
                    {{ formData.processing ? 'Saving...' : 'Save Address' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { API } from '@/utils/api';
import { useForm } from '@inertiajs/vue3'
import { reactive, ref } from 'vue'

const props = defineProps({
    address: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['submit', 'cancel', 'applycahnges', "addnewaddress"])

// Sample countries list - replace with your actual countries list
const countries = ref([
    'United provinces',
    'Canada',
    'United Kingdom',
    'Australia',
    // Add more countries as needed
])

const initialData = {
    id: null,
    name: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
    is_default: false
};


const formData = ref(props.address  ?? initialData);

const submitForm = async () => {

    if (props.address?.id) {
        try {
            const { data } = await API.post('update-address');
            emit("applycahnges", formData.value);


        } catch (error) {
            console.log("faild to update address");

        }

    } else {
        try {
            const { data } = await API.post('add-new-address');
            emit("addnewaddress", formData.value);


        } catch (error) {
            console.log("faild to update address");

        }
    }


}


</script>

<style scoped>
/* Smooth transitions */
button,
input,
select {
    transition: all 0.2s ease;
}
</style>