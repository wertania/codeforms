<template>
  <div class="flex flex-column">
    <!-- Dropdown to choose the Start-Page -->
    <div class="field">
      <label for="choose-start-page">Choose Start-Page</label>
      <Dropdown
        class="w-full"
        id="choose-start-page"
        :options="pages"
        option-label="label"
        option-value="value"
        v-model="innerStartPage"
        @change="emit('update:startPage', innerStartPage)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  pages: { label: string; value: string }[];
  startPage: string;
}>();

const emit = defineEmits(['update:startPage']);

const innerStartPage = ref(props.startPage);
</script>
