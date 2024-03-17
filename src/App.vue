<template>
  <Toast />
  <router-view :key="route.path" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>
