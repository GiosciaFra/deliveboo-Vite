<script>
export default {

    name: 'RestaurantItem',

    props : {
        restaurant: Object,
    }
}

</script>

<template>
    <router-link :to="{name: 'single-restaurant', params: {id: restaurant.id}}">

        <!-- card -->
        <div class="rest-card">

            <!-- img -->
            <div class="image-wrapper">
                <img 
                    :src="'http://localhost:8000/storage/' + restaurant.image" 
                    :alt="'immagine ristorante ' + restaurant.restaurant_name"
                >
            </div>

            <!-- restaurant info -->
            <div class="rest-card__info">
                <h2>{{ restaurant.restaurant_name }}</h2>
                <p>{{ restaurant.address }}</p>
            </div>

            <!-- dish type -->
            <div class="rest-card__type">        
                <span 
                    v-for="currentType in restaurant.types"
                    :key="currentType.id"
                    class="type"
                >
                    {{ currentType.name }}
                </span>
            </div>

            <!-- overlay -->
            <div class="overlay"></div>
        </div>
    </router-link>
</template>

<style lang="scss" scoped>
@use "../style/partials/variables" as *;
@use "../style/partials/mixins" as *;

.rest-card {
    @include box1;
    display: flex;
    flex-direction: column;
    height: 100%;

    position: relative;

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $dark-30;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover .overlay {
        opacity: 1;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* Aspect ratio 16:9 */
        overflow: hidden;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

  .rest-card__info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;

    h2 {
        @include title2-semi;
        margin: 0 0 4px;
    }

    p {
        font-size: $txt5;
        margin:0;
    }
  }

  .rest-card__type {
    background-color: $primary1;
    padding: 4px 8px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;

    .type {
            font-size: $txt5;
            text-transform: uppercase;
            color: $light;
    }
  }
}

</style>