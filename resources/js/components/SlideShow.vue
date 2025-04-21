<template>
    <div class="wrap-main-slide">
        <div class="slide-carousel owl-carousel d-flex style-nav-1 slideShow" data-items="1" data-loop="1"
            data-nav="true" data-dots="false">
            <div v-for="(slide, index) in slides" :key="index" class="item-slide position-relative slides">
                <!-- <img :src="`/assets/images/${slide.image}`" :alt="slide.title" class="img-slide" /> -->
                <ImageComponent :source="`assets/images/${slide.image}`" :alt="slide.title" class="img-slide" />

                <div :class="['slide-info', slide.slideClass]">
                    <h2 class="f-title" v-html="slide.title"></h2>

                    <span class="subtitle" v-if="slide.subtitle">
                        {{ slide.subtitle }}
                    </span>

                    <p class="sale-info" v-if="slide.price">
                        {{ slide.priceLabel || "Only price:" }}
                        <span class="price">{{ slide.price }}</span>
                    </p>

                    <p class="discount-code" v-if="slide.discountCode">
                        {{ slide.discountCode }}
                    </p>

                    <template v-if="slide.freeTitle">
                        <h4 class="s-title">{{ slide.freeTitle }}</h4>
                        <p class="s-subtitle">{{ slide.freeSubtitle }}</p>
                    </template>

                    <a v-if="slide.cta" href="#" class="btn-link">
                        {{ slide.cta }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ImageComponent from "./ImageComponent.vue";
import { ref } from "vue";
const props = defineProps(['content']);
const slides = ref(props.content);
</script>

<style scoped>
.slides {
    position: relative;
    min-width: 100%;
    max-width: 1200px;
    min-height: 100%;
    height: 100%;
}

.slideShow {
    overflow: hidden;
    aspect-ratio: 16/7;
}

.slides img {
    width: 100%;
    object-fit: cover;

}
</style>