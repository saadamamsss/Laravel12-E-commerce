<script setup>
import InputError from '@/components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import {route} from "ziggy-js";

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>

    <Head title="Log in" />

    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">


            <!-- Title -->
            <h2 class="mt-6 text-center text-3xl font-extrabold text-[#444444]">
                Welcome back
            </h2>

            <p class="mt-2 text-center text-sm text-[#444444]/80">
                Sign in to your account
            </p>

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

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-[#444444] mb-1">Password</label>
                        <input id="password" v-model="form.password" type="password" required
                            class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="••••••••">
                        <InputError class="mt-2" :message="form.errors.password" />
                    </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" type="checkbox" name="remember" v-model="form.remember"
                            class="h-4 w-4 my-0 text-[#ff2832] focus:ring-[#ff2832]/50 border-[#e6e3de] rounded">
                        <label for="remember-me" class="ml-2 my-0 block text-sm text-[#444444]">
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <a :href="route('password.request')"
                            class="font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"
                        :disabled="form.processing">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/80 group-hover:text-white"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>
                        Sign in
                    </button>
                </div>
            </form>

            <!-- Sign Up Link -->
            <div class="text-center text-sm text-[#444444]">
                Don't have an account?
                <a :href="route('register')" class="font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                    Sign up
                </a>
            </div>
        </div>
    </div>


    <!-- <script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}
</script> -->


</template>

<style scoped>
/* Custom scrollbar for form inputs */
input::-webkit-input-placeholder {
    @apply text-[#444444]/40;
}

input:-moz-placeholder {
    @apply text-[#444444]/40;
}

input::-moz-placeholder {
    @apply text-[#444444]/40;
}

input:-ms-input-placeholder {
    @apply text-[#444444]/40;
}

/* Focus styles */
input:focus,
button:focus {
    outline: none;

    @apply ring-2 ring-[#ff2832]/50;
}

input[type='checkbox'] {
    box-shadow: none;
}
</style>