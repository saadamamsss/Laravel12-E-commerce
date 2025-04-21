<script setup>
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import {route} from "ziggy-js";
defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};
</script>

<template>
    <!-- <GuestLayout> -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">

            <Head title="Forgot Password" />

            <div class="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will allow
                you to choose a new one.
            </div>

            <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
                {{ status }}
            </div>

            <!-- Form -->
            <form class="mt-8 space-y-6" @submit.prevent="submit">
                <div class="rounded-md space-y-4">
                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-[#444444] mb-1">Email address</label>
                        <input id="email" v-model="form.email" type="email" required
                            class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="you@example.com">
                        <InputError class="mt-2" :message="form.errors.email" />
                    </div>


                </div>


                <!-- Submit Button -->
                <div>
                    <button type="submit"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"
                        :class="{ 'opacity-25': form.processing }" :disabled="form.processing">

                        Email Password Reset Link
                    </button>
                </div>
            </form>


        </div>
    </div>




</template>
