<template>
  <div class="formgrid grid">
    <div class="field col">
      <label :for="labelCol1">
        {{ labelCol1 }}
      </label>
      <InputText
        :id="labelCol1"
        class="w-full"
        autocomplete="off"
        v-model="value1"
      />
    </div>
    <div class="field col">
      <label :for="labelCol2">
        {{ labelCol2 }}
      </label>
      <InputText
        :id="labelCol1"
        class="w-full"
        autocomplete="off"
        v-model="value2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
const props = defineProps({
  labelCol1: String,
  labelCol2: String,
  value1: String,
  value2: String,
});

const emit = defineEmits(['update:value1', 'update:value2']);

const value1 = ref(props.value1);
const value2 = ref(props.value2);

watch(
  () => props,
  () => {
    value1.value = props.value1;
    value2.value = props.value2;
  },
);

watch(
  () => value1.value,
  (newValue) => {
    emit('update:value1', newValue);
  },
);

watch(
  () => value2.value,
  (newValue) => {
    emit('update:value2', newValue);
  },
);
</script>
