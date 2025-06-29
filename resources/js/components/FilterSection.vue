<template>
    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12 sitebar position-sticky">
        <!-- Categories widget-->
        <FilterList title="category" :items="props.categories" :link="true" />

        <!-- brand widget-->
        <FilterList v-if="props.brands.length" title="brand" :items="props.brands" v-model="FILTERS.brand" />

        <!-- Color -->
        <FilterList title="color" :items="COLORS" v-model="FILTERS.color" />

        <!-- Size -->
        <FilterList title="size" :items="SIZES" v-model="FILTERS.size" />

        <!-- Price widget -->
        <div class="widget mercado-widget filter-widget price-filter">
            <h2 class="widget-title mb-2">Price</h2>
            <p class="row mx-0 pricefiltercheckbox">
                <input type="checkbox" id="useprice" class="input" v-model="FilterPrice" />
                <label for="useprice" class="colors">Apply Price Filter</label>
            </p>
            <div class="widget-content">
                <div id="slider-range"></div>
                <p>
                    <label for="amount">Price:</label>
                    <input type="text" id="amount" readonly />
                </p>
            </div>
            <input type="hidden" id="minprice" :value="RANGE_PRICE[0]" />
            <input type="hidden" id="maxprice" :value="RANGE_PRICE[1]" />
            <input type="hidden" id="RangeVlaue" ref="price_range_value" :value="priceRangeValue" />
        </div>

        <div class="d-flex gap-2 flex-wrap">
            <button :disabled="!filtersHasValues" @click="applyFilter"
                class="border border-[#e6e3de] bg-[#ff2832] text-white hover:text-black hover:bg-[#ddd] py-3 px-4 text-center font-medium transition-colors duration-200 shadow-sm">
                FILTER
            </button>
            <button @click="clearFilters"
                class="flex-1 bg-[#444444] hover:bg-[#ddd] text-white hover:text-black py-3 px-4  text-center font-medium transition-colors duration-200"
                v-if="hasAppliedFilters">
                CLEAR FILTER
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch} from "vue";
import { Link, router, usePage } from "@inertiajs/vue3";
import FilterList from "./FilterList.vue";

const { url: pageUrl } = usePage();
const locationURL = ref(pageUrl);


const url_search = computed(() => {
    return locationURL.value.split("?")[1];
});

const props = defineProps({
    categories: {
        type: Array,
        default: () => [],
    },
    brands: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['refetch']);

const price_range_value = ref(null);
const COLORS = [
    "red",
    "blue",
    "white",
    "black",
    "green",
    "yellow",
    "pink",
    "purple",
    "beige",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const RANGE_PRICE = [0, 1000];
const FilterPrice = ref(false);
const FILTERS = reactive({
    search: [],
    color: [],
    size: [],
    brand: [],
    price: [],
});

const getAppliedFilters = (search = null) => {
    const params = new URLSearchParams(search ?? url_search.value);
    const object = Object.fromEntries(params.entries());

    Object.keys(object).forEach(key => {
        FILTERS[key] = params.get(key).split("--");
    });
    // 
    FilterPrice.value = !!FILTERS.price.length;

};

getAppliedFilters();

const priceRangeValue = computed(() => {
    return FILTERS.price?.length ? FILTERS.price.join(',') : RANGE_PRICE.join(',');
});

const hasAppliedFilters = computed(() => {
    return (new URLSearchParams(url_search.value).size > 0);
});

const filtersHasValues = computed(() => {
    return Object.keys(FILTERS).some(key => FILTERS[key].length) || FilterPrice.value;
});

function getPriceFilter() {
    return price_range_value.value.value.split(",");
}


// Helper function to add array params
function applyFilter() {
    const params = new URLSearchParams();

    FILTERS.price = FilterPrice.value ? getPriceFilter() : [];
    // 
    Object.keys(FILTERS).forEach(key => {
        if (FILTERS[key].length) params.append(key, FILTERS[key].join("--"));
        else params.delete(key);
    })
    // 
    const search = params.toString();
    const url = search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname;

    // 
    window.history.pushState(null, null, url);
    locationURL.value = url;
    // 
    emit('refetch', search);

}

function clearFilters() {
    locationURL.value = locationURL.value.split('?')[0];
    window.history.pushState(null, null, locationURL.value);
    Object.assign(FILTERS , {search: [],color: [],size: [],brand: [],price: []});
    // 
    emit('refetch', "");
}


</script>

<style scoped>
.categories-widget .default-hiden {
    display: none;
}

.pricefiltercheckbox input {
    appearance: unset;
    display: none;
    visibility: hidden;
}

.pricefiltercheckbox input:checked+label::after {
    opacity: 1;
}
</style>
