<template>
  <div class="field">
    <label :for="label">
      {{ label }}
    </label>
    <InputText
      v-if="!longtext"
      :id="label"
      class="w-full"
      autocomplete="off"
      v-model="value"
    />
    <Textarea v-else :id="label" class="w-full" v-model="value" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
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
