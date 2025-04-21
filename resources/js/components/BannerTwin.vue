<template>
    <div class="wrap-banner style-twin-default">
        <div v-for="(banner, index) in banners" :key="index" class="banner-item">
            <a :href="banner.link || '#'" class="link-banner banner-effect-1">
                <figure>
                    <img :src="banner.image" :alt="banner.alt || 'Banner image'" :width="banner.width"
                        :height="banner.height" />
                </figure>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(['content']);
const banners = ref(props.content);
</script>
