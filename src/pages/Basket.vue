<script>

import { eventBus } from '../eventBus.js';
import { store } from '../store.js';

import OrderForm from '../components/OrderForm.vue'

export default {
    name: 'Basket',

    data() {
        return {
            // recupero il cart dal local storage
            cart: JSON.parse(localStorage.getItem('cart')) || [],

            store, 
        };
    },

    components: {
        OrderForm,
    },

    mounted() {
        this.store.isLoading = false
    },

    computed: {

        // calcolo del totale di tutti i piatti
        totalPrice() {
            localStorage.setItem('totalPrice', 0)

            let total_price = this.cart.reduce((total, item) => {
                return total + (item.dish.price * item.quantity);
            }, 0).toFixed(2);

            localStorage.setItem('totalPrice', total_price)

            return total_price

        }
    },

    methods: {
        // calcolo dei singoli piatti per la quantità selezionata 
        dishSumPrice(item) {
            return (item.dish.price * item.quantity).toFixed(2);
        },

        // ---------------------------------------------- //

        // aggiunta quantità del piatto al local storage 
        addQuantity(item) {
            item.quantity++;
            this.updateLocalStorage();
            this.emitCartUpdate();
        },
        // se il piatto risulta presente lo rimuovo o diminuisco la quantità
        removeQuantity(item) {
            if (item.quantity > 1) {
                item.quantity--

                // aggiorno lo storage
                this.updateLocalStorage();

                this.emitCartUpdate();
            }
        },


        // rimozione del piatto con tutte le quantità dal carrello
        removeDish(item) {
            this.cart = this.cart.filter(cartItem => cartItem !== item);

            // aggiorno lo storage
            this.updateLocalStorage();

            this.emitCartUpdate();
        },

        // rimozione di tutti i piatti dal carrello
        removeAll() {
            // svuoto il carrello 
            this.cart = [];
            // aggiorno lo storage
            this.updateLocalStorage();
            this.emitCartUpdate();

        },

        // ---------------------------------------------- //

        // funzione per aggiornare costantemente il carrello
        updateLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        emitCartUpdate() {
            const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemCount = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            eventBus.emit('updateCart', itemCount);
        }
    },

   
}
</script>

<template>
    <section>
        <div v-if="store.isLoading == true" class="d-flex flex-column align-items-center mt-5 gap-5">
            <div  class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>
                Stiamo processando il tuo ordine, attendi di essere reindirizzato...
            </div>
        </div>


        <div v-else class="container">

            <!-- bottone home -->
            <div class="page-top">
                <router-link class="btn btn-outline-dark " :to="{ name: 'home' }">
                    <i class="fa-solid fa-chevron-left"></i>
                </router-link>
                <h2 class="title">Carrello</h2>
            </div>


            <!-- se il carrello contiene degli articoli li mostro -->
            <div v-if="cart.length > 0" class="order-container">

                <h2 class="title">Il mio ordine</h2>

                <div class="my-order">

                    <!-- DISH LIST -->
                    <div class="dish-list">

                        <!-- dish card -->
                        <div v-for="item in cart" :key="item.dish.id" class="dish-card">
                        
                            <div v-if="item.dish.image" class="dish-img">
                                <img :src="'http://localhost:8000/storage/' + item.dish.image" alt="">
                            </div>

                            <div class="dish-txt">
                                <!-- dati piatto -->
                                <div class="dish-info">
                                    <div class="name">{{ item.dish.name }}</div>
                                    <div class="price">€ {{item.dish.price }} x {{item.quantity }} = € {{ dishSumPrice(item) }}</div>
                                </div>

                                <div class="buttons">
                                    <!-- modifica quantità -->
                                    <div class="mod-quantity">
                                        <button type="button" class="btn-left" @click="removeQuantity(item)">-</button>
                                        <span class="number">{{ item.quantity }}</span>
                                        <button type="button" class="btn-right" @click="addQuantity(item)">+</button>
                                    </div>

                                    <!-- elimina questo piatto -->
                                    <button type="button" class="btn btn-delete" @click="removeDish(item)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- delete all + total -->
                        <div class="order-total">
                            <button type="button" class="btn btn-outline-danger empty" data-bs-toggle="modal" data-bs-target="#deleteModal">Svuota il carrello</button>

                            <!-- Modal svuotare il carrello -->
                            <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            Vuoi davvero svuotare il carrello? Tutti i dati inseriti andranno persi
                                        </div>

                                        <div class="modal-footer">
                                            <!-- annulla azione -->
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Annulla</button>
                                            <!-- conferma azione -->
                                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                                @click="removeAll()">Prosegui</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- totale carrello -->
                            <div class="total">
                                <span>Totale:</span> <span class="fw-bold"> € {{ totalPrice }}</span>
                            </div>
                        </div>

                        <!-- restaurant info -->
                        <div class="rest-info">
                            <h2 class="title">{{ cart[0].restaurantInfo.restaurant_name }}</h2>
                            <p>
                                <span>
                                    <i class="fa-solid me-2 fa-location-dot"></i>{{ cart[0].restaurantInfo.address }}  
                                </span>
                                <span>
                                    <i class="fa-solid me-2 fa-phone"></i>+39 {{ cart[0].userInfo.phone_number }}  
                                </span>
                                <span>
                                    <i class="fa-solid me-2 fa-envelope"></i>{{ cart[0].userInfo.email }}    
                                </span>
                            </p>
                        </div>

                    </div>


                    <!-- SIDEBAR -->
                    <div class="payment col-md-4 col-xs-12">   
                        <OrderForm></OrderForm>              
                    </div>
                </div>

            </div>

            <!-- se nessun articolo risulta presente nel carrello -->
            <div v-else class="my-5 text-center ">
                Il tuo carrello è vuoto. <br>
                Torna indietro per vedere i nostri ristoranti.
            </div>

        </div>
    </section>

</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;
@use "../style/partials/mixins" as *;

.container {
    display: flex;
    flex-direction: column;
}

// bottone home
.page-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 24px;

    .btn:hover i {
        color: $light;
    }
}

// carrello con articoli
.order-container {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .title {
        @include title-semi;
    } 
}

.my-order {
    display: flex;
    gap: 24px;

    @media (max-width: 768px) {
        flex-direction: column;
    }

    // DISH LIST
    .dish-list {
        display: flex;
        flex-direction: column;
        gap: 18px;
        flex-grow: 1;

        // delete all + total
        .order-total {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .empty {
                font-size: $txt5;
            }

            .total {
                font-size: $txt3;
            }
        }

        // dish card
        .dish-card {
            @include box1;
            display: flex;

            .dish-img {
                aspect-ratio: 16 / 9;
                max-width: 40%;
                min-width: 16%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .dish-txt {
                padding: 18px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 16px;
                // flex-grow: 1;

                @media (max-width: 768px) {
                    justify-content: flex-start;
                }


                .dish-info {
                    display: flex;
                    flex-direction: column;

                    .name {
                        @include title3-semi;
                    }

                    .price {
                        font-size: $txt5;
                    }

                }
                
            }
        }

        // restaurant info
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

                @media (max-width: 992px) {
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

    }

}

// DISH-CARD -> BUTTONS
.buttons {
    display: flex;
    gap: 24px;
    justify-content: flex-start;

    font-size: $txt4;

    .mod-quantity {
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

    .btn-delete{
        padding: 4px 8px;
        border: 1px solid $primary1;
        border-radius: 0.375rem;
        min-width: 40px;
        text-align: center;
      
    }
    .btn-delete:hover i {
        color: $light;
    }
}

</style>