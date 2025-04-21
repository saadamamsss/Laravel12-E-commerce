<template>
    <div class="main-content-area">
        <div class="wrap-address-billing">
            <h3 class="box-title">Billing Address</h3>
            <form method="post" id="billing-form" @submit.prevent="placeOrder">

                <p class="row-in-form">
                    <label for="fname">first name<span>*</span></label>
                    <input id="fname" type="text" name="name" v-model="form.billing_name" placeholder="Your name"
                        required />
                    <span class="text-red" v-if="form.errors.billing_name">*{{ form.errors.billing_name }}</span>
                </p>
                <p class="row-in-form">
                    <label for="email">Email Addreess:</label>
                    <input id="email" type="email" name="email" v-model="form.billing_email"
                        placeholder="Type your email" required />
                    <span class="text-red" v-if="form.errors.billing_email">*{{ form.errors.billing_email }}</span>
                </p>
                <p class="row-in-form">
                    <label for="phone">Phone number<span>*</span></label>
                    <input id="phone" type="number" name="phone" v-model="form.billing_phone"
                        placeholder="10 digits format" required />
                    <span class="text-red" v-if="form.errors.billing_phone">*{{ form.errors.billing_phone }}</span>
                </p>
                <p class="row-in-form">
                    <label for="line_1">Line 1<span>*</span></label>
                    <input id="line_1" type="text" name="address_1" v-model="form.billing_address_1"
                        placeholder="line 1" required />
                    <span class="text-red" v-if="form.errors.billing_address_1">*{{ form.errors.billing_address_1
                    }}</span>
                </p>
                <p class="row-in-form">
                    <label for="line_2">Line 2<span>*</span></label>
                    <input id="line_2" type="text" name="address_2" v-model="form.billing_address_2"
                        placeholder="line 2" required />
                    <span class="text-red" v-if="form.errors.billing_address_2">*{{ form.errors.billing_address_2
                    }}</span>
                </p>
                <p class="row-in-form">
                    <label for="country">Country<span>*</span></label>
                    <input id="country" type="text" name="country" v-model="form.billing_country"
                        placeholder="United States" required />
                    <span class="text-red" v-if="form.errors.billing_country">*{{ form.errors.billing_country }}</span>
                </p>
                <p class="row-in-form">
                    <label for="province">Province<span>*</span></label>
                    <input id="province" type="text" name="province" v-model="form.billing_province"
                        placeholder="United States" required />
                    <span class="text-red" v-if="form.errors.billing_province">*{{ form.errors.billing_province
                    }}</span>
                </p>
                <p class="row-in-form">
                    <label for="zipcode">Postcode / ZIP:</label>
                    <input id="zipcode" type="number" name="zip-code" v-model="form.billing_zipCode"
                        placeholder="Your postal code" required />
                    <span class="text-red" v-if="form.errors.billing_zipCode">*{{ form.errors.billing_zipCode }}</span>
                </p>
                <p class="row-in-form">
                    <label for="city">Town / City<span>*</span></label>
                    <input id="city" type="text" name="city" v-model="form.billing_city" placeholder="City name"
                        required />
                    <span class="text-red" v-if="form.errors.billing_city">*{{ form.errors.billing_city }}</span>
                </p>

                <p class="row-in-form fill-wife">
                    <label class="checkbox-field">
                        <input name="different-add" id="different-add" v-model="form.diff_address" type="checkbox" />
                        <span>Ship to a different address?</span>
                    </label>
                </p>


                <!--  -->
                <div class="summary summary-checkout">
                    <div class="summary-item payment-method">
                        <h4 class="title-box">Payment Method</h4>
                        <span class="text-red" v-if="form.errors.paymentMethod">*{{ form.errors.paymentMethod }}</span>
                        <div class="choose-payment-methods row border-top-0">
                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <label class="payment-method">
                                    <input name="payment-method" id="payment-method-delivery" value="cod" type="radio"
                                        v-model="form.paymentMethod" />
                                    <span>cash on delivery</span>
                                    <span class="payment-desc">But the majority have suffered alteration in some form,
                                        by
                                        injected humour, or randomised words which don't look even
                                        slightly believable</span>
                                </label>
                                <label class="payment-method">
                                    <input name="payment-method" id="payment-method-visa" value="visa" type="radio"
                                        v-model="form.paymentMethod" />
                                    <span>visa</span>
                                    <span class="payment-desc">There are many variations of passages of Lorem Ipsum
                                        available</span>
                                </label>
                                <label class="payment-method">
                                    <input name="payment-method" id="payment-method-paypal" value="paypal" type="radio"
                                        v-model="form.paymentMethod" />
                                    <span>Paypal</span>
                                    <span class="payment-desc">You can pay with your credit</span>
                                    <span class="payment-desc">card if you don't have a paypal account</span>
                                </label>
                            </div>

                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <div class="wrap-address-billing" v-if="form.paymentMethod == 'visa'">
                                    <div class="py-3" v-if="paymentError">
                                        {{ paymentError }}
                                    </div>

                                    <div id="cardform">
                                        <p class="row-in-form">
                                            <label for="card-number">Card Number</label>
                                            <input type="text" id="card-number" name="card-number"
                                                v-model="form.card_numbr" />
                                        </p>
                                        <p class="row-in-form">
                                            <label for="expiry-Month">Expiry Month</label>
                                            <input type="text" id="expiry-Month" name="exp-month"
                                                v-model="form.card_expMonth" />
                                        </p>
                                        <p class="row-in-form">
                                            <label for="expiry-Year">Expiry Year</label>
                                            <input type="text" id="expiry-Year" name="exp-year"
                                                v-model="form.card_expYear" />
                                        </p>
                                        <p class="row-in-form">
                                            <label for="cvc">CVC</label>
                                            <input type="text" id="cvc" name="cvc" v-model="form.card_cvc" />
                                        </p>
                                    </div>
                                </div>

                                <p class="summary-info grand-total">
                                    <span>Grand Total</span>
                                    <span class="grand-total-price">${{ $props.grandtotal }}</span>
                                </p>

                                <div class="paypal-pay-method" v-if="form.paymentMethod == 'paypal'"
                                    style="width: 250px">
                                    <div id="paypal-button-container"></div>
                                </div>

                                <div v-else>
                                    <button type="submit" class="btn btn-medium">
                                        <Spinner v-if="form.processing" />
                                        <span>Place Order Now</span>
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>
<script setup>
import { useForm } from '@inertiajs/vue3';
import Spinner from './Spinner.vue';
import { route } from "ziggy-js";

const props = defineProps(['grandtotal']);

const form = useForm({
    billing_name: "",
    billing_email: "",
    billing_phone: "",
    billing_country: "",
    billing_city: "",
    billing_province: "",
    billing_address_1: "",
    billing_address_2: "",
    billing_zipCode: "",
    diff_address: false,
    paymentMethod: null,
    card_numbr: null,
    card_expMonth: null,
    card_expYear: null,
    card_cvc: null,

});

const placeOrder = async () => {
    form.post(route('place.order'), {
        preserveScroll: true,
        onFinish: ({ data }) => {
        },
        onSuccess: () => {
            form.reset();
        }
    })

}

</script>