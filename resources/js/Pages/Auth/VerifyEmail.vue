<script setup>
import { computed } from 'vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import {route} from "ziggy-js";
const props = defineProps({
    status: {
        type: String,
    },
});

const form = useForm({});

const submit = () => {
    form.post(route('verification.send'));
};

const verificationLinkSent = computed(
    () => props.status === 'verification-link-sent',
);
</script>

<template>

    <Head title="Email Verification" />
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">


            <div class="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your
                email address by clicking on the link we just emailed to you? If you
                didn't receive the email, we will gladly send you another.
            </div>

            <div class="mb-4 text-sm font-medium text-green-600" v-if="verificationLinkSent">
                A new verification link has been sent to the email address you
                provided during registration.
            </div>

            <form @submit.prevent="submit">
                <div class="mt-4 flex items-center justify-between">
                    <button type="submit" :class="{ 'opacity-25': form.processing }"
                        class="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"
                        :disabled="form.processing">
                        Resend Verification Email
                    </button>

                    <Link :href="route('logout')" method="post" as="button"
                        class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Log Out</Link>
                </div>
            </form>
        </div>
    </div>
</template>
