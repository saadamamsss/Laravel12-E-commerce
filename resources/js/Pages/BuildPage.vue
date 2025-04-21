<script setup>
import SlideShow from "@/components/SlideShow.vue";
import ProductSection from "@/components/ProductSection.vue";
import BannerTwin from "@/components/BannerTwin.vue";
import BannerSingle from "@/components/BannerSingle.vue";
import ProductCategory from "@/components/ProductCategory.vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";


const componentsMap = {
    slide_show: SlideShow,
    product_collection: ProductSection,
    banner_twin: BannerTwin,
    banner_single: BannerSingle,
    product_category: ProductCategory,
};
const props = defineProps(["data"]);



</script>

<template>
    <DefaultLayout>
        <main id="main" class="main-site">
            <div class="container">
                <Suspense>
                    <component v-for="(component, i) in props.data" :is="componentsMap[component.name]" :key="i"
                        :content="component.fields" />
                </Suspense>
            </div>
        </main>
    </DefaultLayout>

</template>
