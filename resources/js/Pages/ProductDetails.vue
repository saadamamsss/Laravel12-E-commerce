<template>
    <!--main area-->
    <DefaultLayout>
        <main id="main" class="main-site">
            <div class="container">
                <div class="wrap-breadcrumb">
                    <ul>
                        <li class="item-link">
                            <Link href="/" class="link">home</Link>
                        </li>
                        <li class="item-link"><span>detail</span></li>
                    </ul>
                </div>

                <div class="row">
                    <div
                        class="col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area"
                    >
                        <div class="wrap-product-detail">
                            <div class="detail-media">
                                <!-- product images viewer -->
                                <div class="product-gallery">
                                    <ul class="slides" v-if="product.images">
                                        <li
                                            v-for="img in product.images.split(
                                                ','
                                            )"
                                            :key="img.index"
                                            class="prod-img-ratio"
                                            :data-thumb="`/assets/images/products/${img}`"
                                        >
                                            <ImageComponent
                                                :source="`/assets/images/products/${img}`"
                                                alt="product thumbnail"
                                            />
                                        </li>
                                    </ul>
                                    <ul class="slides" v-else>
                                        <li
                                            :data-thumb="`/assets/images/products/${product.image}`"
                                        >
                                            <ImageComponent
                                                :source="`/assets/images/products/${product.image}`"
                                                alt="product thumbnail"
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--  -->
                            <div class="detail-info">
                                <!-- rate -->
                                <div class="product-rating">
                                    <i
                                        class="fa fa-star"
                                        aria-hidden="true"
                                        v-for="i in 5"
                                        :key="i"
                                        :style="{
                                            color:
                                                i <= Math.ceil(product.avg_rate)
                                                    ? '#efce4a'
                                                    : '#aaa',
                                        }"
                                    ></i>

                                    <a href="#" class="count-review"
                                        >({{ reviews.length }} review)</a
                                    >
                                </div>

                                <div class="mb-4 border-bottom pb-3">
                                    <h2 class="text-2xl font-bold my-0">
                                        {{ product.name }}
                                    </h2>
                                    <div
                                        class="short-desc"
                                        v-html="product.shortDesc"
                                    ></div>
                                </div>

                                <div class="wrap-price mt-0">
                                    <span class="product-price"
                                        >${{ product.price }}</span
                                    >
                                </div>

                                <!-- Add to cart btn -->
                                <!--  -->
                                <div v-if="product.variants?.length">
                                    <VariantView
                                        :variants="product.variants"
                                        :variantType="product.variantType"
                                        :productId="product.id"
                                        :showqty="true"
                                    />
                                </div>

                                <div v-else class="mt-4">
                                    <div class="mx-0" v-if="product.quantity">
                                        <div class="quantity mb-3">
                                            <span class="mb-1"
                                                ><strong
                                                    >Available Qty :
                                                </strong>
                                                {{ product.quantity }}
                                            </span>
                                            <div class="quantity-input">
                                                <span>{{ quantity }}</span>
                                                <button
                                                    :disabled="quantity === 1"
                                                    class="q-btn btn btn-reduce"
                                                    @click.prevent="decreaseQty"
                                                ></button>
                                                <button
                                                    :disabled="
                                                        quantity ==
                                                        product.quantity
                                                    "
                                                    class="q-btn btn btn-increase"
                                                    @click.prevent="increaseQty"
                                                ></button>
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            <AddToCartButton
                                                :productId="product.id"
                                                :drawer="false"
                                                :quantity="quantity"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <!--  -->

                                <div class="py-0 w-full">
                                    <div class="wrap-btn">
                                        <a href="#" class="btn btn-compare"
                                            >Add Compare</a
                                        >
                                        <a href="#" class="btn btn-wishlist"
                                            >Add Wishlist</a
                                        >
                                    </div>
                                </div>
                            </div>
                            <!-- Additional Info -->
                            <div class="advance-info">
                                <div class="tab-control normal">
                                    <a
                                        href="#description"
                                        class="tab-control-item active"
                                        >description</a
                                    >
                                    <a
                                        href="#add_infomation"
                                        class="tab-control-item"
                                        >Addtional Infomation</a
                                    >
                                    <a href="#review" class="tab-control-item"
                                        >Reviews</a
                                    >
                                </div>
                                <div class="tab-contents">
                                    <div
                                        class="tab-content-item active"
                                        id="description"
                                        v-html="product.description"
                                    ></div>

                                    <div
                                        class="tab-content-item"
                                        id="add_infomation"
                                        v-html="product.features"
                                    ></div>
                                    <!--  -->
                                    <div class="tab-content-item" id="review">
                                        <div
                                            class="wrap-review-form d-flex flex-column"
                                        >
                                            <div id="comments">
                                                <h2
                                                    class="woocommerce-Reviews-title"
                                                >
                                                    {{ reviews.length }} review
                                                    for
                                                    <span>{{
                                                        product.name
                                                    }}</span>
                                                </h2>
                                                <ol class="commentlist">
                                                    <li
                                                        class="comment byuser comment-author-admin bypostauthor even thread-even depth-1"
                                                        id="li-comment-20"
                                                        v-for="(
                                                            review, index
                                                        ) in reviews"
                                                        :key="index"
                                                    >
                                                        <div
                                                            id="comment-20"
                                                            class="comment_container"
                                                        >
                                                            <ImageComponent
                                                                v-if="
                                                                    review.user
                                                                        .avatar
                                                                "
                                                                :source="`/assets/images/${review.user.avatar}`"
                                                                height="80"
                                                                width="80"
                                                                alt=""
                                                            />

                                                            <span
                                                                class="avatar"
                                                                style="
                                                                    background: #bbb;
                                                                "
                                                                v-else
                                                            >
                                                                {{
                                                                    review.user
                                                                        .name[0]
                                                                }}
                                                            </span>

                                                            <div
                                                                class="comment-text"
                                                            >
                                                                <div
                                                                    class="product-rating"
                                                                >
                                                                    <i
                                                                        class="fa fa-star"
                                                                        aria-hidden="true"
                                                                        v-for="i in 5"
                                                                        :key="i"
                                                                        :style="{
                                                                            color:
                                                                                i <=
                                                                                review.rate
                                                                                    ? '#efce4a'
                                                                                    : '#aaa',
                                                                        }"
                                                                    ></i>
                                                                </div>
                                                                <p class="meta">
                                                                    <strong
                                                                        class="woocommerce-review__author"
                                                                    >
                                                                        {{
                                                                            review
                                                                                .user
                                                                                .name
                                                                        }}
                                                                    </strong>
                                                                    <span
                                                                        class="woocommerce-review__dash"
                                                                        >–</span
                                                                    >
                                                                    <span
                                                                        class="woocommerce-review__published-date"
                                                                    >
                                                                        {{
                                                                            new Date(
                                                                                review.created_at
                                                                            ).toDateString()
                                                                        }}
                                                                    </span>
                                                                </p>
                                                                <div
                                                                    class="description"
                                                                >
                                                                    <p>
                                                                        {{
                                                                            review.review
                                                                        }}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ol>
                                            </div>
                                            <!-- #comments -->

                                            <div v-if="$page.props.auth?.user">
                                                <ReviewForm
                                                    @add-to-reviews="
                                                        addToReviews
                                                    "
                                                    :productId="product.id"
                                                />
                                            </div>
                                            <!-- #review_form_wrapper -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- side -->
                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12 sitebar">
                        <div class="widget widget-our-services">
                            <div class="widget-content">
                                <ul class="our-services">
                                    <li class="service">
                                        <a class="link-to-service" href="#">
                                            <i
                                                class="fa fa-truck"
                                                aria-hidden="true"
                                            ></i>
                                            <div class="right-content">
                                                <b class="title"
                                                    >Free Shipping</b
                                                >
                                                <span class="subtitle"
                                                    >On Oder Over $99</span
                                                >
                                                <p class="desc">
                                                    Lorem Ipsum is simply dummy
                                                    text of the printing...
                                                </p>
                                            </div>
                                        </a>
                                    </li>

                                    <li class="service">
                                        <a class="link-to-service" href="#">
                                            <i
                                                class="fa fa-gift"
                                                aria-hidden="true"
                                            ></i>
                                            <div class="right-content">
                                                <b class="title"
                                                    >Special Offer</b
                                                >
                                                <span class="subtitle"
                                                    >Get a gift!</span
                                                >
                                                <p class="desc">
                                                    Lorem Ipsum is simply dummy
                                                    text of the printing...
                                                </p>
                                            </div>
                                        </a>
                                    </li>

                                    <li class="service">
                                        <a class="link-to-service" href="#">
                                            <i
                                                class="fa fa-reply"
                                                aria-hidden="true"
                                            ></i>
                                            <div class="right-content">
                                                <b class="title"
                                                    >Order Return</b
                                                >
                                                <span class="subtitle"
                                                    >Return within 7 days</span
                                                >
                                                <p class="desc">
                                                    Lorem Ipsum is simply dummy
                                                    text of the printing...
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- Categories widget-->
                    </div>
                </div>
            </div>
        </main>
    </DefaultLayout>
    <!--main area-->
</template>

<script setup>
import AddToCartButton from "@/components/AddToCartButton.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import ReviewForm from "@/components/ReviewForm.vue";
import VariantView from "@/components/VariantView.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { Link } from "@inertiajs/vue3";
import { ref } from "vue";

const props = defineProps(["product"]);

const reviews = ref(props.product.reviews);

function addToReviews(review) {
    reviews.value.push(review);
}

const quantity = ref(1);

function increaseQty() {
    if (quantity.value < props.product.quantity) {
        quantity.value += 1;
    }
}
function decreaseQty() {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
}
</script>
