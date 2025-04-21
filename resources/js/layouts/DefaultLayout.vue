<template>

    <Header />

    <slot />

    <Footer />

</template>

<script setup>
import Header from "@/components/Header.vue";
import { onMounted } from "vue";
import { InitallFunctions } from "../utils/initfunctions";
import Footer from "@/components/Footer.vue";

onMounted(() => {
    InitallFunctions();
    setTimeout(() => {
        InitallFunctions();
    }, 1000);
});
</script>
