<script>

import axios from 'axios';

import { store } from '../store.js';

import { eventBus } from '../eventBus.js';

export default {

    name: 'SingleRestaurant',

    data() {
        return {

            store,

            // dati singolo ristorante 
            restaurant: [],
            // dati ristoratore
            user: [],

            restaurantId: '',

            // messaggio di errore da mostrare
            errorMessage: '',

            // carrello 
            cart: [],

        }
    },

    created() {
        this.loadCart();

        this.store.isLoading = true
    },

    methods: {

        // aggiorno il carrello con quello del local storage 
        loadCart() {
            const storedCart = JSON.parse(localStorage.getItem('cart'));
            if (storedCart) {
                this.cart = storedCart;
            }
        },

        // aggiunta piatto al local storage
        addToCart(dish) {

            let restaurantId = localStorage.getItem('restaurantId');
            let existingItem = this.cart.find(p => p.dish.id === dish.id);
            let restaurantInfo = this.restaurant;
            let userInfo = this.user;


            // controllo che il carrello sia vuoto o l'id del ristorante del primo piatto inserito corrisponda ai successivi 
            if (this.cart.length === 0 || this.cart[0].restaurantId === restaurantId) {

                // se il piatto è già presente incrementa la quantità
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    // altrimenti inserisci il piatto nel carrello con 'quantity = 1'
                    this.cart.push({ dish, quantity: 1, restaurantId, restaurantInfo, userInfo });
                }

                // salvo il carrello aggiornato
                localStorage.setItem('cart', JSON.stringify(this.cart));
            } else {

                // se l'id del ristorante non corrisponde al primo piatto nel carrello 
                this.errorMessage = 'Puoi ordinare da un solo ristorante per volta. Concludi il tuo ordine oppure svuota il carrello.';
            }


            localStorage.setItem('cart', JSON.stringify(this.cart));
            const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            eventBus.emit('updateCart', itemCount);
        },


        // rimuovi un piatto dal carrello e aggiornalo
        removeFromCart(dish) {

            let item = this.cart.find(item => item.dish.id === dish.id);

            // se il piatto ha una quantità superiore a 1 decrementala
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // rimuovi il piatto dal carrello
                this.cart = this.cart.filter(item => item.dish.id !== dish.id);
            }

            // aggiorna il local storage
            localStorage.setItem('cart', JSON.stringify(this.cart));

            localStorage.setItem('cart', JSON.stringify(this.cart));
            const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            eventBus.emit('updateCart', itemCount);
        },

        // ritorna la quantità di ogni piatto nel carrello
        getQuantity(dish) {
            let item = this.cart.find(item => item.dish.id === dish.id);
            return item ? item.quantity : 0;
        },


        // funzione per aggiornare costantemente il carrello
        updateLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        emitCartUpdate() {
            const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            eventBus.emit('updateCart', itemCount);
        },

        removeAll() {
            // svuoto il carrello 
            this.cart = [];
            // aggiorno lo storage
            this.updateLocalStorage();
            this.emitCartUpdate();
            this.errorMessage = ''

        },

        
    },


    // ---------------------------------------------- //


    // ottenere l'id del ristorante selezionato
    mounted() {
        this.restaurantId = this.$route.params.id;
        localStorage.setItem('restaurantId', this.restaurantId);

        axios.get(this.store.baseApiUrl + '/restaurants/' + this.restaurantId).then(res => {
            this.restaurant = res.data.restaurant
            this.user = res.data.restaurant.user

            this.store.isLoading = false
        })
    }


}
</script>

<template>
    <section>
        <div v-if="store.isLoading" class="d-flex flex-column align-items-center mt-5 gap-5">
            <div  class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div class="container" v-else>

            <div class="page-top">
                <router-link class="btn btn-outline-dark " :to="{ name: 'home' }">
                    <i class="fa-solid fa-chevron-left"></i>
                </router-link>

                <!-- restaurant info -->
                <div class="rest-info">
                    <h2 class="title">{{ restaurant.restaurant_name }}</h2>
                    <p>
                        <span>
                            <i class="fa-solid me-2 fa-location-dot"></i>{{ restaurant.address }}  
                        </span>
                        <span>
                            <i class="fa-solid me-2 fa-phone"></i>+39 {{ user.phone_number }}  
                        </span>
                        <span>
                            <i class="fa-solid me-2 fa-envelope"></i>{{ user.email }}    
                        </span>
                    </p>
                </div>
            </div>

            <!-- wrong restaurant error message -->
            <div v-if="errorMessage" class="alert alert-danger error-msg">
                <span>{{ errorMessage }}</span>
                <div class="error-btns">
                    <button @click="removeAll()" type="button" class="btn btn-outline-danger">
                        Svuota il carrello
                    </button>
                    <router-link class="btn btn-outline-secondary" :to="{ name: 'basket' }">
                        Concludi l'ordine
                    </router-link>
                </div>
            </div>




            <!-- dishes list -->
            <ul>
                <li v-for="dish in restaurant.dishes" v-show="dish.viewable" class="list-group-item">
                    <div class="dish-card">
                        <div v-if="dish.image" class="dish-card_img">
                            <img :src="'http://localhost:8000/storage/' + dish.image" alt="">
                        </div>
                        <div class="dish-card_text">
                            <div class="dish-info">
                                <h3>{{ dish.name }}</h3>
                                <p>
                                    {{ dish.description }}
                                </p>
                                <span class="fw-semibold">€ {{ dish.price }}</span>
                            </div>

                            <!-- add to cart -->
                            <div class="add-to-cart">
                                <button type="button" class="btn-left" @click="removeFromCart(dish, 1)">-</button>
                                <span class="number">{{ getQuantity(dish) }}</span>
                                <button type="button" class="btn-right" @click="addToCart(dish, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

        </div>
    </section>
</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;
@use "../style/partials/mixins" as *;

.page-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;

    margin-bottom: 24px;

    .rest-info {
        @include box1;
        padding: 10px 16px;
    
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: $grey1;

        .title {
            @include title3-semi;
            margin: 0;
            padding: 0;

        }

        p {
            font-size: $txt5;
            margin: 0;

            display: flex;
            gap: 8px;

            @media (max-width: 768px) {
                flex-direction: column;
            }

            i {
                margin: 0 2px 0px;

                &:first-of-type {
                    margin-left: 0;
                }
            }
        }
    }

    .btn:hover i {
        color: $light;
    }
}


// error message
.error-msg {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .error-btns {
        display: flex;
        gap: 10px;
    }
}

// dishes list
ul {
    padding: 0;

    li {
        margin-bottom: 20px
    }
}

.dish-card {
    @include box1;

    display: flex;
    align-items: stretch;
    width: 100%;

    .dish-card_img {
        width: 30%;
        aspect-ratio: 16 / 9;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .dish-card_text {
        flex: 1;
        padding: 20px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .dish-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 14px;
            gap: 6px;

            h3 {
                @include title2-semi;
                margin: 0;
                padding: 0;
            }

            p {
                margin: 0;
                padding: 0;
                font-size: $txt5;
            }
        }

        .add-to-cart {
            display: flex;
            align-items: center;
        }

        button {
        background-color: white;
        border: 1px solid $primary1;
        padding: 4px 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: $primary1;
            color: white;
        }

        &:first-of-type {
            // border-right: none;
            border-top-left-radius: 0.375rem;
            border-bottom-left-radius: 0.375rem;
        }

        &:last-of-type {
            // border-left: none;
            border-top-right-radius: 0.375rem;
            border-bottom-right-radius: 0.375rem;
        }
    }

    .number {
        padding: 4px 8px;
        border: 1px solid $primary1;
        border-left: none;
        border-right: none;
        min-width: 40px;
        text-align: center;
    }
    }
}
</style>

