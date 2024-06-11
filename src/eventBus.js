import { reactive, readonly } from 'vue';

const state = reactive({
    cartCount: 0
});

// Funzione per inizializzare il conteggio del carrello
function initializeCartCount() {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    state.cartCount = storedCart.reduce((acc, item) => acc + item.quantity, 0);
}

// Chiamata alla funzione all'avvio
initializeCartCount();

export const eventBus = {
    emit(event, data) {
        if (event === 'updateCart') {
            state.cartCount = data;
        }
    },
    on(event, callback) {
        if (event === 'updateCart') {
            callback(state.cartCount);
        }
    },
    getState() {
        return readonly(state);
    }
};

