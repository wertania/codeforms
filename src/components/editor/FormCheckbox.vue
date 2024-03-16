<template>
  <div class="field">
    <label :for="label">
      {{ label }}
    </label>
    <Checkbox :id="label" class="w-full" v-model="value" :binary="true" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
const props = defineProps({
  label: String,
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const value = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  },
);

watch(
  () => value.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
);
</script>
