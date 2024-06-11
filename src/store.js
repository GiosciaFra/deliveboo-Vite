import { reactive } from 'vue'


export const store = reactive({

    types: [],
    restaurants: [],
    filteredRestaurants: [],
    isLoading: true,


     
    baseApiUrl: 'http://127.0.0.1:8000/api',
    baseUrl: 'http://localhost:5173',

});