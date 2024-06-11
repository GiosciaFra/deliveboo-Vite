<script>

import { store } from '../store.js';

export default {

    name: 'AppFilter',

    data(){
        return{
            store,

            // tipologie selezionate 
            activeTypes: [],
        }
    },

    emits: ['filter'], // dichiarare l'evento 'filtro'

    methods: {
       filterByTypes(type) {
            // ricerco l'index della tipologia 
           const index = this.activeTypes.indexOf(type);
           
           if (index > -1) {
                // Rimuove il type se già presente
               this.activeTypes.splice(index, 1); 
           } else {
                // Aggiunge il type se non presente
               this.activeTypes.push(type); 
           }
           
           this.$emit('filter', this.activeTypes);
       }
   },
}

</script>

<template>

    <h2>Filtra</h2>

    <!-- types list -->
    <ul class="d-types">
        <li v-for="currentType in store.types" :key="currentType.name">
            <div class="type">
                <a href="#" 
                :class="['', activeTypes.includes(currentType.name) ? 'active' : 'deactive']"
                @click="filterByTypes(currentType.name)"
                >
                <i :class="activeTypes.includes(currentType.name) ? 'fa-regular fa-square-check' : 'fa-regular fa-square'"></i><span>{{ currentType.name }}</span></a>
            </div>
        </li>
    </ul>

</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;
@use "../style/partials/mixins" as *;

h2 {
    @include title2-semi;
    margin: 0 0 10px; 
}

.d-types {
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 8px;

    padding: 0;
    font-size: $txt3;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        font-size: $txt4;
    }

    .type {
        a {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }
 
    .active {
        i {
            color: $primary1;
        }
    }

    .deactive {
        i {
            color: $grey8;
        }
    }

    .deactive:hover {
        i {
            color: $primary1;

        }
    }

}

</style>