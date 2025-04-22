<template>

    <AuthenticatedLayout>
        <div v-if="!showAddForm && !editingAddress"
            class="bg-white shadow-md rounded-lg border px-3 py-3 flex justify-end">
            <button @click.stop="showAddForm = true"
                class="bg-[#ff2832]/90 px-4 py-2 rounded-lg text-white hover:bg-[#ff2832]/80">Add New Address</button>
        </div>
        <div v-if="!showAddForm && !editingAddress" v-for="address in addresses"
            class="rounded-lg p-6 bg-white transition-shadow duration-200"
            :class="address.is_default ? 'ring-1 ring-[#ff2832]' : 'hover:ring-1 hover:ring-[#ff2832]/80'">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-medium text-[#444444]">{{ address.name }}</h3>
                    <p class="text-sm text-[#444444]/80 mt-1">{{ address.phone }}</p>
                </div>

                <div class="flex space-x-2">
                    <!-- Default Badge -->
                    <span v-if="address.is_default"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]">
                        Default
                    </span>

                    <!-- Edit Button -->
                    <button @click.stop="EditAddress(address)"
                        class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>

                    <!-- Delete Button -->
                    <button @click.stop="deleteAddress(address.id)"
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
            <div v-if="!address.is_default" class="mt-4">
                <button @click.stop="setDefaultAddress(address.id)"
                    class="text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                    Set as default
                </button>
            </div>
        </div>



        <!-- In Address Book -->
        <AddressEditForm v-if="editingAddress" :address="editingAddress" @cancel="editingAddress = null"
            @applycahnges="applyEditAddress" />

        <!-- For Adding New Address -->
        <AddressEditForm v-if="showAddForm" @cancel="showAddForm = false" @addnewaddress="AddNewAddress" />
    </AuthenticatedLayout>

</template>

<script setup>

import AddressEditForm from '@/components/AddressEditForm.vue';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { API } from '@/utils/api';
import { ref } from 'vue';

const props = defineProps(['addresses']);

const addresses = ref(props.addresses);

// const isDefault = (id) => {
//    
// }

const showAddForm = ref(false);


const setDefaultAddress = async (id) => {
    try {
        const { data } = await API.post("set-address-default", id);
        if (data.success) {
            resetDefaultAddress(id);
            changeDefaultAddress(id);
        }
    } catch (error) {

    }

}
const deleteAddress = async (id) => {
    try {
        const { data } = await API.delete("delete-address", id);

        if (data.success) {
            addresses.value = addresses.value.filter(addr => addr.id !== id);
        }
    } catch (error) {

    }

}

const editingAddress = ref(null);
const EditAddress = (address) => {

    editingAddress.value = address;
}

const applyEditAddress = (data) => {
    if (data.is_default) {
        resetDefaultAddress(data.id);
    }

    // close
    editingAddress.value = null
}

const AddNewAddress = (data) => {
    data.id = Math.max(...addresses.value.map(m => m.id), 0) + 1;
    addresses.value = [data, ...addresses.value];
    if (data.is_default) {
        resetDefaultAddress(data.id)
    }
    // close
    showAddForm.value = false;

}

function resetDefaultAddress(id) {
    const address = addresses.value.find(i => i.is_default == true && i.id !== id);
    address.is_default = false;
}
// 
function changeDefaultAddress(id) {
    const newDefaultAddr = addresses.value.find(i => i.id == id);
    newDefaultAddr.is_default = true;
}
</script>

<style scoped>
/* Smooth transitions */
button,
div {
    transition: all 0.2s ease;
}
</style>