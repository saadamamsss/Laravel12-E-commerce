<template>
    <div v-if="props.content.image" class="wrap-top-banner py-5">
        <a :href="props.content.url" class="link-banner banner-effect-2">
            <figure>
                <img :src="`/assets/images/${props.content.image}`" width="1170" height="240" alt="" />
            </figure>
        </a>
    </div>
</template>
<script setup>
const props = defineProps(['content']);


</script>
