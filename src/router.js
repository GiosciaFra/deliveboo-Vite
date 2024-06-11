import { createRouter, createWebHistory } from "vue-router";

import HomePage from './pages/HomePage.vue';
import SingleRestaurant from './pages/SingleRestaurant.vue';
import Basket from "./pages/Basket.vue";
import OrderSuccess from "./pages/OrderSuccess.vue";

const router = createRouter ({
    history: createWebHistory(),

    // rotte gestite 
    routes: [
        // rotta lista ristoranti
        {
            path: '/',
            name: 'home',
            component: HomePage
        },

        // rotta dettagli ristorante
        {
            path: '/ristorante/:id',
            name: 'single-restaurant',
            component: SingleRestaurant
        },

        // rotta carrello
        {
            path: '/carrello',
            name: 'basket',
            component: Basket
        },

        // rotta ordine 
        {
            path: '/conferma-ordine',
            name: 'order-success',
            component: OrderSuccess
        },
    ]
});

export { router };