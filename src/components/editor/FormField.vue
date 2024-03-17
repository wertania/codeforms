<template>
  <FloatLabel class="mt-4 mb-1">
    <InputText
      v-if="!longtext"
      :id="label"
      class="w-full"
      autocomplete="off"
      v-model="value"
    />
    <Textarea v-else :id="label" class="w-full" v-model="value" />
    <label :for="label">
      {{ label }}
    </label>
  </FloatLabel>
</template>

<script setup lang="ts">
import FloatLabel from 'primevue/floatlabel';
import { ref, watch } from 'vue';
const props = defineProps({
  label: String,
  modelValue: String,
  longtext: Boolean,
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
