<template>
    <div class="widget mercado-widget">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <h2 class="widget-title">{{ props.title }}</h2>
            <a href="#" @click.prevent="toggleCollapse" class="control-show-more">
                <i class="fa fa-plus" aria-hidden="true" v-if="!collapsed"></i>
                <i class="fa fa-minus" aria-hidden="true" v-else></i>
            </a>
        </div>
        <div class="widget-content">
            <ul class="list-style vertical-list has-count-index color-filter">
                <!--  -->
                <li class="list-item mt-2" v-show="collapsed" v-for="item in props.items" :key="item">
                    <Link v-if="props.link" class="filter-link" :href="item.slug">{{ item.name }}</Link>
                    <template v-else>
                        <input type="checkbox" :id="item.slug ? item.slug : item" class="input"
                            :name="`sectionFilter_${props.title}`" :value="item.slug ? item.slug : item"
                            v-model="localFilters" :checked="modelValue?.includes(
                                item.slug ? item.slug : item
                            )
                                " />
                        <label :for="item.slug ? item.slug : item" class="colors">
                            {{ item.name ? item.name : item }}
                        </label>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { Link } from "@inertiajs/vue3";
import { computed, ref } from "vue";
const props = defineProps(["items", "title", "modelValue", "link"]);
const emit = defineEmits(["update:modelValue"]);

const collapsed = ref(!!props.modelValue?.length);

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
};

const localFilters = computed({
    get: () => props.modelValue || [],
    set: (value) => emit("update:modelValue", value),
});
</script>
