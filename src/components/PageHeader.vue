<script>
import { eventBus } from '../eventBus.js';
export default {

    name: 'PageHeader',
    setup() {
        const cartState = eventBus.getState();

        return {
            cartState
        };
    },

    data() {
        return {
            hover: false,
            // cartItemCount: 0
        };
    },

    created() {
        eventBus.on('updateCart', (newCount) => {
            this.cartItemCount = newCount;
        });
    },

    methods: {
        redirectToLogin() {
            window.location.href = 'http://127.0.0.1:8000/admin';
        }
    }

}
</script>

<template>
    <header>
        <nav class="container">

            <!-- link alla lista -->
            <router-link :to="{ name: 'home' }">
                <div class="logo">
                    <img src="/img/deliveboo-logo.png" alt="">
                </div>
            </router-link>
            <div class="icons">

                <!-- link al carrello -->
                <router-link :to="{ name: 'basket' }" class="icon-container" @mouseover="hover = true"
                    @mouseleave="hover = false">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span v-show="hover" class="login-tooltip">Vai al carrello</span>
                    <span class="cart-count">{{ cartState.cartCount }}</span>
                </router-link>

                <!-- link al login -->
                <div class="icon-container" @mouseover="hover = true" @mouseleave="hover = false">
                    <i class="fa-solid fa-user" @click="redirectToLogin()"></i>
                    <span v-show="hover" class="login-tooltip">Hai un ristorante?</span>
                </div>
            </div>
        </nav>
    </header>
</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;


header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: $light;
    filter: drop-shadow(0 0 0.2rem $grey2);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 16px 10px;


    .logo {

        max-width: 9rem;

    }

    .icons {
        color: $grey8;
        font-size: 1.4rem;

        display: flex;
        align-items: center;
        gap: 1rem;

        cursor: pointer;

    }
    
    .fa-solid:hover {    
        color: #ef4860;
    }

    .icon-container {
        position: relative;
        display: inline-block;
    }

    .login-tooltip {
        font-size: $txt5;
        text-wrap: nowrap;
        position: absolute;
        top: 100%;
        left: 0%;
        transform: translateX(-70%);
        background-color: $grey2;
        color: $grey7;
        padding: 4px 8px;
        border-radius: 10px;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.5s, visibility 0.5s;
        cursor: default;
    }

    .icon-container:hover .login-tooltip {
        visibility: visible;
        opacity: 1;
    }

    .cart-count {
        position: absolute;
        top: -6px;
        right: -10px;

        display: flex;
        align-items: center;
        justify-content: center;

        min-width: 20px;
        height: 20px;

        background-color: #ef4860;
        color: white;

        font-size: 0.75rem;

        padding: 2px 6px;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);


        &:hover {
            color: white;
        }
    }
}
</style>