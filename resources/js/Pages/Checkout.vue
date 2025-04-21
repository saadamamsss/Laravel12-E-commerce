<template>
    <!--main area-->
    <DefaultLayout>

        <main id="main" class="main-site">
            <div class="container">
                <div class="wrap-breadcrumb">
                    <ul>
                        <li class="item-link"> <Link href="/" class="link">home</Link></li>
                        <li class="item-link"><span>Checkout</span></li>
                    </ul>
                </div>

                <CheckoutForm :grandtotal="props.total"/>

                <!--end main content area-->
            </div>
            <!--end container-->
        </main>
        <!--main area-->

    </DefaultLayout>
</template>

<script setup>
import CheckoutForm from '@/components/CheckoutForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps(['total']);
</script>