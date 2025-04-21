<template>
    <DefaultLayout>
        <main id="main" class="main-site">
            <div class="container">
                <div class="row mx-0">
                    <div class="wrap-breadcrumb col-12">
                        <ul>
                            <li class="item-link">
                                <Link href="/" class="link">home</Link>
                            </li>
                            <li class="item-link"><span>Cart</span></li>
                        </ul>
                    </div>

                    <!--  -->
                    <div class="main-content-area shopping-cart col-12" v-if="cart">
                        <!-- cart Content -->
                        <div v-if="cart?.count > 0">
                            <div class="wrap-iten-in-cart">
                                <h3 class="box-title">Products Name</h3>
                                <ul class="products-cart">
                                    <li class="pr-cart-item" v-for="(item, index) in cart.content" :key="index">
                                        <div class="product-image">
                                            <figure>
                                                <img v-if="item.model?.images" :src="`/assets/images/products/${item.model?.images?.split(
                                                    ','
                                                )[0]
                                                    }`" alt="" />
                                            </figure>
                                        </div>
                                        <div class="product-name">
                                            <a class="link-to-product" :href="`/products/${item.model?.slug}`">
                                                {{ item.name }}
                                            </a>
                                        </div>
                                        <div class="price-field produtc-price">
                                            <p class="price">
                                                ${{ item.price }}
                                            </p>
                                        </div>
                                        <div class="quantity">
                                            <CartItemQty @refresh-cart="refreshCart" :quantity="item.qty"
                                                :rowId="item.rowId" :maxQty="item.model?.quantity ?? 0
                                                    " />
                                        </div>

                                        <div class="price-field sub-total">
                                            <p class="price">
                                                ${{ item.subtotal }}
                                            </p>
                                        </div>

                                        <CartItemRemover @refresh-cart="refreshCart" :rowId="item.rowId" />
                                    </li>
                                </ul>
                            </div>

                            <div class="row mx-0 border py-3 px-3 gap-y-5">
                                <div class="col-12 col-md-4">
                                    <h4 class="text-lg md:text-xl mb-3">Order Summary</h4>
                                    <p class="flex justify-between mb-3 font-bold">
                                        <span class="text-sm">Subtotal </span>
                                        <b class="text-sm">
                                            ${{ cart.subtotal }}
                                        </b>
                                    </p>
                                    <p class="flex justify-between mb-3 font-bold">
                                        <span class="text-sm">Shipping</span><b class="text-sm">Free Shipping</b>
                                    </p>
                                    <p class="flex justify-between mb-3 font-bold">
                                        <span class="text-sm">Tax</span>
                                        <b class="text-sm"> ${{ cart.tax }} </b>
                                    </p>
                                    <p class="flex justify-between mb-3 font-bold" v-if="cart.coupon">
                                        <span class="text-sm">Discount</span>
                                        <b class="text-sm">
                                            ${{ cart.discount }}
                                        </b>
                                    </p>
                                    <hr />
                                    <p class="flex justify-between mt-3 font-bold">
                                        <span class="text-sm">Total</span>
                                        <b class="text-sm">
                                            ${{ cart.discountedTotal }}
                                        </b>
                                    </p>
                                </div>

                                <div class="col-12 col-md-5 d-flex justify-center" v-if="!cart.coupon">
                                    <div class="md:px-5 pt-4 mt-3 w-full">
                                        <label class="inline-flex items-center gap-2">
                                            <input class="rounded-sm checked:bg-[#ff2832] checked:hover:bg-[#ff2832] checked:focus:bg-[#ff2832] ring-0 focus:ring-0" name="have-code" id="have-code" type="checkbox"
                                                v-model="haveCoupon" />
                                            <span>I have coupon code</span>
                                        </label>
                                        <!-- coupon Form -->
                                        <div class="row-in-form pt-3 fadding" v-if="haveCoupon">
                                            <form method="post" @submit.prevent="applyCoupon()">
                                                <div class="mb-1">
                                                    <input id="coupon-code" type="text"class="text-sm ring-0 focus:ring-0 border-2 focus:border-[#ff2832]/70 transition"
                                                        placeholder="Enter Your Coupon code" v-model="coupon_code" />
                                                    <span v-if="error" class="text-danger d-block mt-1">* {{ error
                                                        }}</span>
                                                </div>

                                                <button class="btn-prime px-3 py-2 flex gap-1 mt-3 transition" type="submit"
                                                    :disabled="applyCouponLoader">
                                                    <Spinner v-if="applyCouponLoader" />
                                                    <span>Apply</span>
                                                </button>
                                            </form>
                                        </div>

                                    </div>
                                </div>

                                <!-- checkout btn -->
                                <div class="col-12 col-md-3 d-flex flex-column gap-3 justify-end mt-5 md:mt-0">
                                    <!-- clear cart btn -->
                                 
                                        <button
                                            class="btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition"
                                            @click.prevent="clearCart()" :disabled="clearCartLoader
                                                ? true
                                                : undefined
                                                ">
                                            <Spinner v-if="clearCartLoader" />
                                            <span>Clear Shopping Cart</span>
                                        </button>

                                        <button v-if="cart.coupon"
                                            class="btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition"
                                            @click.prevent="removeCoupon()" :disabled="removeCouponLoader
                                                ? true
                                                : undefined
                                                ">
                                            <Spinner v-if="removeCouponLoader" />
                                            <span>Remove Coupon</span>
                                        </button>

                                        <Link
                                            class="btn text-center btn-prime btn-checkout py-2 align-self-end transition"
                                            :href="route('checkout')">Check out</Link>
                              
                                </div>
                            </div>
                        </div>

                        <!-- empty Cart -->
                        <div class="cartempty" v-else>
                            <h1>Cart Empty!</h1>
                            <Link :href="route('shop')">Continue shopping
                            <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></Link>
                        </div>
                    </div>
                </div>

                <!-- Most Viewed Products -->

                <ProductSectionView v-if="props.data.public_products.length" title="Most Viewed"
                    :products="props.data.public_products" />

                <!--  -->
            </div>
        </main>
    </DefaultLayout>
</template>

<script setup>
import { ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import CartItemQty from "@/components/CartItemQty.vue";
import CartItemRemover from "@/components/CartItemRemover.vue";
import ProductSectionView from "@/components/ProductSectionView.vue";
import Spinner from "@/components/Spinner.vue";
import { API } from "@/utils/api.js";
import { useCartState } from "../stores/CartState";
import { Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";

const CART = useCartState();

const props = defineProps(["data"]);

const cart = ref(JSON.parse(props.data.cart));
const clearCartLoader = ref(false);
const removeCouponLoader = ref(false);
const applyCouponLoader = ref(false);
const coupon_code = ref("");
const haveCoupon = ref(false);
const error = ref(null);

//
function refreshCart(data) {
    cart.value = data;
    CART.setCartCount(data.count);
}
//
async function clearCart() {
    clearCartLoader.value = true;
    try {
        const { data } = await API.get("clear-cart");
        cart.value = data;
        document.getElementById("cartindex").innerText = 0;
    } catch (error) {
        console.log("faild to clear the cart");
    } finally {
        clearCartLoader.value = false;
    }
}
//
async function removeCoupon() {
    removeCouponLoader.value = true;
    try {
        const { data } = await API.get("remove-coupon");

        cart.value = data;
    } catch (error) {
        console.log("faild to remove this coupon !");
    } finally {
        removeCouponLoader.value = true;
    }
}
//
async function applyCoupon() {
    if (this.coupon_code.trim() == "") {
        error.value = "you should provide a code.";
        return
    }

    applyCouponLoader.value = true;
    try {
        const { data } = await API.post("apply-coupon", {
            coupon_code: this.coupon_code,
        });

        if (data.error) {
            error.value = data.error;
            return;
        }
        cart.value = data.cart;
    } catch (error) {
        console.log("faild to apply this coupon !");
    } finally {
        applyCouponLoader.value = false;
    }
}
</script>

<style scoped></style>