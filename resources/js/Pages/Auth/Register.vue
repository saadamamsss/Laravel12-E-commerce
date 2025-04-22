<script setup>
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { route } from "ziggy-js";
const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>

    <Head title="Register" />
    <div class="min-h-screen flex items-center justify-center bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full bg-white px-10 py-6 rounded-xl shadow-lg">
            <!-- Title -->
            <h2 class="text-center text-3xl font-bold text-[#444444] mb-2">
                Create your account
            </h2>
            <p class="text-center text-[#444444]/80 mb-8">
                Join our community today
            </p>

            <!-- Form -->
            <form class="space-y-4" @submit.prevent="submit">
                <!-- Name -->
                <div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>

                        <input id="email" v-model="form.name" type="text" required
                            class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="Full Name">

                    </div>
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Email -->
                <div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <input id="email" v-model="form.email" type="email" required
                            class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="Email Address">

                    </div>
                    <InputError :message="form.errors.email" />
                </div>

                <!-- Password -->
                <div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input id="password" v-model="form.password" type="password" required
                            class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="••••••••">
                    </div>
                    <InputError :message="form.errors.password" />
                    <p class="mt-1 text-xs text-[#444444]/60">Minimum 8 characters</p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input id="password_confirmation" v-model="form.password_confirmation" type="password" required
                            class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200"
                            placeholder="••••••••">
                    </div>
                    <InputError :message="form.errors.password_confirmation" />
                </div>

                <!-- Terms Checkbox -->
                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input id="terms" v-model="form.terms" type="checkbox"
                            class="focus:ring-[#ff2832] h-4 w-4 text-[#ff2832] border-[#e6e3de] rounded" required>
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="terms" class="font-medium text-[#444444]">
                            I agree to the <a href="#" class="text-[#ff2832] hover:text-[#ff2832]/80">Terms</a> and <a
                                href="#" class="text-[#ff2832] hover:text-[#ff2832]/80">Privacy Policy</a>
                        </label>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                    class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 transform hover:scale-[1.02]"
                    :disabled="form.processing" :class="{ 'opacity-75 cursor-not-allowed': form.processing }">
                    <svg v-if="form.processing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ form.processing ? 'Creating account...' : 'Sign up' }}
                </button>
            </form>

            <!-- Login Link -->
            <div class="mt-6 text-center text-sm text-[#444444]">
                Already have an account?
                <Link :href="route('login')"
                    class="font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200">
                Sign in
                </Link>
            </div>
        </div>
    </div>

</template>



<style scoped>
/* Custom input placeholder color */
input::placeholder {
    color: #44444440;
}

/* Smooth transitions for all interactive elements */
button,
input,
a {
    transition: all 0.2s ease;
}

/* Focus styles */
input:focus,
button:focus {}
</style>
