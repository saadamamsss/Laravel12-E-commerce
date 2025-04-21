<template>

    <figure class="relative flex">
        <img v-if="source" ref="imageref" :data-src="source" :class="{ 'loaded': loaded }" :alt="alt">
        <div v-if="!loaded && imageref?.src == ''" class="image-placeholder"></div>
    </figure>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';


const props = defineProps({
    source: {
        type: String,
        default: null
    },
    alt: {
        type: String,
        default: ""
    },

    class: {
        type: String,
        default: ""
    },

});

const loaded = ref(false);
const observer = ref(null);
const imageref = ref();

onMounted(() => {
    ObservImage();
})
watch(() => props.source, () => {
    ObservImage();
    loadImage();
}, { deep: true });

function ObservImage() {
    observer.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage();
                observer.value.unobserve(imageref.value);
            }
        });
    }, {
        rootMargin: '0px 0px 100px 0px' // Load 100px before entering viewport
    });

    observer.value.observe(imageref.value);
}

onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect();
    }

});

function loadImage() {
    const img = new Image();
    img.src = imageref.value.dataset.src;
    img.onload = () => {
        imageref.value.src = props.source;
        loaded.value = true;
    };
    img.onerror = () => {
        // Handle error
    };
}

</script>

<style scoped>
figure {
    height: 100%;
}

img {
    width: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.loaded {
    opacity: 1;
}

.image-placeholder {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ddd;
    z-index: 1;
}
</style>