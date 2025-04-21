<script setup>
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import {route} from "ziggy-js";
const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('password.store'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">

            <Head title="Reset Password" />

            <form @submit.prevent="submit">
                <div>
                    <label for="email" class="block text-sm font-medium text-[#444444] mb-1">Email address</label>
                    <input id="email" v-model="form.email" type="email" required
                        class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                        placeholder="you@example.com">
                    <InputError class="mt-2" :message="form.errors.email" />
                </div>

                <div class="mt-4">

                    <label for="password" class="block text-sm font-medium text-[#444444] mb-1">Password</label>
                    <input id="password" v-model="form.password" type="password" required
                        class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                        placeholder="••••••••">
                    <InputError class="mt-2" :message="form.errors.password" />

                </div>

                <div class="mt-4">
                    <div>
                        <label for="password_confirmation"
                            class="block text-sm font-medium text-[#444444] mb-1">Password
                            Confirm</label>
                        <input id="password_confirmation" v-model="form.password_confirmation" type="password" required
                            class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="••••••••">
                        <InputError class="mt-2" :message="form.errors.password_confirmation" />
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-end">
                    <button type="submit" :class="{ 'opacity-25': form.processing }"
                        class="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"
                        :disabled="form.processing">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
