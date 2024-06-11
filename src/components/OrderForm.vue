<script>

import axios from 'axios'
import { store } from '../store.js'

export default {
    name: 'OrderForm',

    data() {
        return {

            store,

            formData: {
                customer_name: '',
                customer_lastname: '',
                customer_address: '',
                customer_email: '',
                customer_phone: '',
                total_price: '',

                dishes: [],
                restaurant_id: '',
            },

            formErrors: [],

            cart: JSON.parse(localStorage.getItem('cart')) || [],

        }
    },




    mounted() {

        console.log(this.store.isLoading)
        var submitButton = document.querySelector("#submit-button");

        braintree.dropin.create(
            {
                authorization: "sandbox_bn3krc5m_5brrmwtybfkxy674",
                selector: "#dropin-container",
            },
            (err, dropinInstance) => {
                if (err) {
                    console.error(err);
                    return;
                }


                submitButton.addEventListener("click", () => {
                    dropinInstance.requestPaymentMethod((err, payload) => {
                        console.log("log payload and err", payload, err);
                        if (err === null) {

                            this.store.isLoading = true;

                            let cart = JSON.parse(localStorage.getItem('cart')) || [];
                            cart.forEach(item => {
                                let dish = {
                                    dish_id: item.dish.id,
                                    quantity: item.quantity
                                }
                                this.formData.dishes.push(dish);

                                this.formData.total_price = localStorage.getItem('totalPrice');
                                this.formData.restaurant_id = localStorage.getItem('restaurantId');
                            });

                            axios.post(this.store.baseApiUrl + '/new-order', this.formData).then(res => {
                                if (res.data.success === false) {
                                    this.formErrors = res.data.errors;
                                } else {
                                    window.location.replace(this.store.baseUrl + '/conferma-ordine');
                                    // this.$router.push({ name: 'OrderSuccess', params: { cart: this.cart } });
                                }
                            });


                        }
                    });
                });
            }
        );

    }


}
</script>

<template>

    <form @submit.prevent="sendOrderRequest" action="">

    <div class="customer-info">

        <h3>Indirizzo di spedizione</h3>

        <div class="form-input">
            <label for="customer_name" class="form-label">Nome</label>
            <input type="text" class="form-control" id="customer_name" name="customer_name" v-model="formData.customer_name" required>
            <div v-if="formErrors['customer_name']" class="alert alert-danger mt-3">
                {{ formErrors['customer_name'][0] }}
            </div>
        </div>

        <div class="form-input">
            <label for="customer_lastname" class="form-label">Cognome</label>
            <input type="text" class="form-control" id="customer_lastname" name="customer_lastname" v-model="formData.customer_lastname" required>
            <div v-if="formErrors['customer_lastname']" class="alert alert-danger mt-3">
                {{ formErrors['customer_lastname'][0] }}
            </div>
        </div>

        <div class="form-input">
            <label for="customer_address" class="form-label">Indirizzo</label>
            <input type="text" class="form-control" id="customer_address" name="customer_address" v-model="formData.customer_address" required>
            <div v-if="formErrors['customer_address']" class="alert alert-danger mt-3">
                {{ formErrors['customer_address'][0] }}
            </div>
        </div>



        <div class="form-input">
            <label for="customer_email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="customer_email" name="customer_email" aria-describedby="emailHelp" v-model="formData.customer_email" required>
            <!-- <div id="emailHelp" class="form-text">Non condivideremo la tua mail con terzi.</div> -->
            <div v-if="formErrors['customer_email']" class="alert alert-danger mt-3">
                {{ formErrors['customer_email'][0] }}
            </div>
        </div>


        <div class="form-input">
            <label for="customer_phone" class="form-label">Numero di telefono</label>
            <input type="text" class="form-control" id="customer_phone" name="customer_phone" v-model="formData.customer_phone" required pattern="[0-9]{10,12}" inputmode="numeric">
            <div v-if="formErrors['customer_phone']" class="alert alert-danger mt-3">
                {{ formErrors['customer_phone'][0] }}
            </div>
        </div>

        <div class="form-text">Non condivideremo i tuoi dati con terzi.</div>

        <!-- payment box -->
        <div id="dropin-wrapper">
        <div id="checkout-message"></div>
        <div id="dropin-container"></div>
        <button id="submit-button" type="submit" class="btn btn-success">Paga</button>
    </div>
    </div>

    </form>

</template>


<style lang="scss" scoped>
@use "../style/partials/variables" as *;
@use "../style/partials/mixins" as *;

.customer-info {
    @include box1;
    padding: 20px;
    background-color: $grey1;

    display: flex;
    flex-direction: column;
    gap: 14px;

    h3 {
        @include title3-semi;
    }

    .form-input {
        margin: 0;
        padding: 0;

        display: flex;
        flex-direction: column;
        gap: 4px;

        .form-label {
            font-size: $txt5;

            margin: 0;
            padding: 0;
        }
    }

    .form-text {
        font-size: $txt6;
    }

    #submit-button {
        width: 100%;
    }
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    display: none;
}
</style>