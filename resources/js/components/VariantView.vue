<template>
    <div>

        <div>
            <h5>{{ mainAttribues.type }}</h5>
            <div class="d-flex gap-2 main-attributes">
                <div v-for="(value, index) in mainAttribues.values" :key="index">
                    <input type="radio" class="d-none" :name="mainAttribues.type" :value="value"
                        :id="`product_attr_${value}`" v-model="selectedAttributes[mainAttribues.type]" />
                    <label :for="`product_attr_${value}`" class="mb-0">
                        <img :src="`/assets/images/products/${variantImg(value)}`" alt="" />
                    </label>
                </div>
            </div>
        </div>

        <div v-for="(attr, index) in subAttribues" :key="index">
            <h5>{{ attr.type }}</h5>
            <div class="d-flex gap-2 sub-atributes">
                <div v-for="(value, index) in attr.values" :key="index">
                    <input type="radio" :name="attr.type" :value="value" class="d-none" :id="`product_attr_${value}`"
                        :disabled="isAvailable(attr.type, value)" v-model="selectedAttributes[attr.type]" />
                    <label :for="`product_attr_${value}`" class="mb-0">
                        {{ value }}
                    </label>
                </div>
            </div>
        </div>
        <br />
        <!-- {{ selectedVariant }} -->
        <div class="row mx-0" v-if="selectedVariant?.id">
            <strong>Available Qty :</strong> {{ selectedVariant.quantity ? selectedVariant.quantity : "Out Stock" }}
        </div>


        <div class="row mx-0" v-if="props.showqty && selectedVariant?.quantity">
            <div class="quantity">
                <div class="quantity-input">
                    <span>{{ quantity }}</span>
                    <a class="q-btn btn btn-reduce" @click.prevent="decreaseQty"></a>
                    <a class="q-btn btn btn-increase" @click.prevent="increaseQty"></a>
                </div>
            </div>
        </div>
        <div class="my-3">
            <AddToCartButton :productId="props.productId" :drawer="false"
                :disabled="!selectedVariant?.id || !selectedVariant.quantity"
                :variantId="selectedVariant?.id ? selectedVariant.id : undefined" :quantity="quantity" />
        </div>


    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import AddToCartButton from "./AddToCartButton.vue";

const props = defineProps(['variants', 'variantType', 'productId', 'showqty']);

const selectedAttributes = ref({});



const prodAttribues = computed(() =>
    props.variants?.reduce((acc, variant) => {
        const { id, SKU, quantity, images, price, ...rest } = variant;
        Object.keys(rest).forEach((key) => {
            if (!rest[key]) return;
            const bv = acc.find((i) => i.type == key);
            if (!bv) {
                acc.push({ type: key, values: [rest[key]] });
                return;
            }
            if (!bv.values.includes(rest[key])) {
                bv.values.push(rest[key]);
            }
        });

        return acc;
    }, [])

)

const mainAttribues = computed(() => prodAttribues.value.find(i => i.type == props.variantType));
const subAttribues = computed(() => prodAttribues.value.filter(i => i.type != props.variantType));


function variantImg(value) {
    return props.variants.find(i => i[props.variantType] == value)?.images?.split(",")[0];
}
const avaliableAttributes = computed(() => props.variants.filter(i => i[props.variantType] == selectedAttributes.value[props.variantType]));

const isAvailable = (type, value) => {
    return !avaliableAttributes.value.find((i) => i[type] && i[type] === value);
}


const selectedVariant = ref(undefined);
watch(() => selectedAttributes.value, () => {
    const values = subAttribues.value?.reduce((acc, attr) => {
        acc = acc.filter((i) => i[attr.type] == selectedAttributes.value[attr.type]);

        if (!acc.length) delete selectedAttributes.value[attr.type];

        return acc;

    }, avaliableAttributes.value);

    selectedVariant.value = values?.[0];
}, { deep: true });


// 
const quantity = ref(1);

function increaseQty() {
    if (quantity.value < selectedVariant.value.quantity) {
        quantity.value += 1;
    }
}
function decreaseQty() {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
}

</script>


<style>
.main-attributes input:checked+label,
.main-attributes label:hover {
    border-color: dodgerblue;
}

.main-attributes label {
    display: inline-block;
    width: 60px;
    border: solid 2px #ddd;
    transition: all 0.3s ease;
    cursor: pointer;
}

.sub-atributes label {
    display: inline-block;
    background-color: #bbb;
    padding: 8px 15px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.sub-atributes input:checked+label,
.sub-atributes input:not(:disabled)+label:hover {
    background-color: #333;
    color: #fff;
}

.sub-atributes input:disabled+label {
    text-decoration: line-through;
    opacity: 0.8;
    cursor: not-allowed;
}
</style>