<template>

    <div v-for="product in count" :key="product" class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
        <div class="product product-style-3 equal-elem">
            <div class="product-thumnail prod-img-ratio">
                <div class="skeleton-image"></div>
            </div>
            <div class="product-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-price"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    count: {
        type: Number,
        default: 4
    }
});
</script>

<style scoped>
.skeleton-image {
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}


.skeleton-title {
    height: 20px;
    width: 80%;
    background: #f0f0f0;
    margin-bottom: 8px;
}

.skeleton-price {
    height: 18px;
    width: 60%;
    background: #f0f0f0;
    margin-bottom: 8px;

}

.skeleton-button {
    height: 38px;
    background: #f0f0f0;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>