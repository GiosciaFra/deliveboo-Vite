<script>
import { store } from './store.js';
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';

export default {
  components: {
    PageHeader,
    PageFooter,
  },

  data() {
    return {
      store,
    }
  },

  mounted() {
    this.setMainPadding();
    window.addEventListener('resize', this.setMainPadding);
  },

  methods: {
    setMainPadding() {
      const headerHeight = this.$refs.headerRef.$el.offsetHeight;
      this.$refs.mainRef.style.paddingTop = headerHeight + 'px';
    }
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.setMainPadding);
  }
}
</script>


<template>
  <PageHeader ref="headerRef"></PageHeader>
  <main ref="mainRef">
    <router-view></router-view>
  </main>
  <PageFooter></PageFooter>
</template>



<style lang="scss">
@use "./style/general.scss";

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 0;
}
</style>