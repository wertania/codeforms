<template>
  <Toast />
  <router-view :key="route.path" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style>
/**
make the padding from the Card component smaller on smaller screens
*/
@media screen and (max-width: 768px) {
  .p-card .p-card-body {
    padding: 0.8rem;
  }
}

/** 
A scrolling problem 
*/
body {
  overflow-x: hidden;
}
</style>
