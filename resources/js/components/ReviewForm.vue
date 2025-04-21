<template>

    <div id="respond" class="comment-respond mt-5">
        <h2>Add Review</h2>
        <form id="commentform" method="post" @submit.prevent="addReview()" class="comment-form">

            <div class="comment-form-rating py-3">
                <label>Your Rating<span class="required">*</span></label>
                <p class="stars d-block">
                    <template v-for="i in 5">
                        <label class="text-2xl" :for="`rate-${i}`"></label>
                        <input type="radio" :id="`rate-${i}`" name="rating" :value="i" v-model="rate"
                            :checked="rate === i" />
                    </template>
                </p>
            </div>

            <div class="comment-form-comment py-3">
                <label for="comment">Your review
                    <span class="required">*</span>
                </label>
                <textarea class="d-block" id="comment" name="comment" cols="45" rows="8" style="resize: none"
                    v-model="comment"></textarea>
            </div>

            <div class="form-submit">
                <button name="submit" type="submit" id="submit" class="btn-prime px-4 py-2" :disabled="loading">
                    <Spinner v-if="loading" />
                    <span>Send</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { API } from '@/utils/api';
import Spinner from './Spinner.vue';

export default {
    name: "ReviewForm",
    components: {
        Spinner
    },
    props: {
        productId: {
            type: Number,
            default: undefined,
            required: true
        }
    },
    data() {
        return {
            rate: 1,
            comment: "",
            loading: false
        }
    },
    methods: {
        async addReview() {
            if (this.comment.trim() == "") return;
            this.loading = true;
            try {
                const { data } = await API.post("add-review",
                    { productId: this.productId, rate: this.rate, review: this.comment });

                if (data.success) {
                    this.$emit("add-to-reviews", data.data);
                    this.rate = 1;
                    this.comment = "";
                }


            } catch (error) {
                console.log("faild to add review");

            } finally {
                this.loading = false;
            }

        }
    }
}
</script>