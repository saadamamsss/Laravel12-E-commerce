<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

const form = useForm({
    name: "",
    email: "",
    phone: "",
    message: "",
});

const successMessage = ref(null);

function sendmessage() {
    form.post(route('contact.send'), {
        preserveScroll: true,
        onFinish: () => { },
        onSuccess: (data) => {
            console.log(data);

            successMessage.value = data?.message;
            form.reset();
        }
    });
}
</script>
<template>
    <DefaultLayout>

        <main id="main" class="main-site left-sidebar">
            <div class="container">
                <div class="wrap-breadcrumb">
                    <ul>
                        <li class="item-link">
                            <Link href="/" class="link">home</Link>
                        </li>
                        <li class="item-link"><span>Contact us</span></li>
                    </ul>
                </div>

                <div class="row mx-0 mb-5">
                    <div class="wrap-contacts my-0 d-block col-12 col-md-6">
                        <div class="contact-box contact-form">
                            <h2 class="box-title">Leave a Message</h2>

                            <!-- Success message -->
                            <div v-if="$page.props?.flash?.success" class="alert alert-success">
                                {{ $page.props?.flash?.success }}
                            </div>

                            <!-- Error message -->
                            <div v-if="$page.props?.flash?.error" class="alert alert-danger">
                                {{ $page.props?.flash?.error }}
                            </div>
                            <br />
                            <form id="frm-contact" enctype="multipart/form-data" @submit.prevent="sendmessage()">
                                <div class="form-group">

                                    <label for="name">Name<span>*</span></label>
                                    <input type="text" id="name" name="name" v-model="form.name" required />
                                    <span class="text-danger" v-if="form.errors.name">{{ form.errors.name
                                    }}</span>
                                </div>
                                <div class="form-group">

                                    <label for="email">Email<span>*</span></label>
                                    <input type="text" id="email" name="email" v-model="form.email" required />
                                    <span class="text-danger" v-if="form.errors.name">{{ form.errors.email
                                    }}</span>
                                </div>
                                <div class="form-group">

                                    <label for="phone">Phone Number<span>(optional*)</span></label>
                                    <input type="text" id="phone" name="phone" v-model="form.phone" />
                                    <span class="text-danger" v-if="form.errors.name">{{ form.errors.phone
                                    }}</span>
                                </div>
                                <div class="form-group">

                                    <label for="message">Message</label>
                                    <textarea name="message" v-model="form.message" id="message" required
                                        maxlength="100"></textarea>
                                    <span class="text-danger" v-if="form.errors.name">{{ form.errors.message
                                    }}</span>
                                </div>

                                <button type="submit" class="flex gap-2 justify-center" :disabled="form.processing">
                                    <i class="fa fa-circle-o-notch fa-spin" v-if="form.processing"></i>
                                    <span>Send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </main>

    </DefaultLayout>
</template>
