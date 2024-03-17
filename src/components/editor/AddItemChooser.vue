<template>
  <div
    class="grid border-round-sm border-1 surface-border shadow-1 m-1 cursor-pointer"
    @click="emit('update:trigger', true)"
  >
    <div class="col-9 flex flex-column">
      <span class="text-lg">{{ label }}</span>
      <span class="text-sm text-gray-500">
        {{ type }}
      </span>
    </div>
    <div class="col-3 p-3">
      <i :class="`${icon} text-2xl text-color-secondary`"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  type: String,
  icon: String,
});

const emit = defineEmits(['update:trigger']);
</script>
