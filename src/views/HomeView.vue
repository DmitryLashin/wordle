<template>
  <div class="home">
    <MainPage/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainPage from '@/components/MainPage.vue';

@Component({
  components: {
    MainPage
  },
})
export default class HomeView extends Vue {}
</script>

<style scoped>

.home {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>