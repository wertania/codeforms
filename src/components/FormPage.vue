<template>
  <Card class="m-auto w-8 mt-5">
    <template #title>
      {{ page.title }}
    </template>
    <template #subtitle>
      {{ page.description }}
    </template>
    <template #content>
      <!--
          PrimeVue components will be added here based on the object.type
          | 'dropdown'
          | 'list'
          | 'text'
          | 'textarea'
          | 'number'
          | 'checkbox'
          | 'switch'
          | 'toggle'
          | 'radio'
          | 'radioimage'
          | 'rating'
          | 'slider'
        -->
      <template v-for="object in page.form">
        <Card class="border-round-sm mb-2">
          <template #subtitle>
            {{ object.label }}
          </template>
          <template #content>
            <!-- multipe inputs -->
            <Dropdown
              v-if="object.type === 'dropdown' && object.options"
              :key="object.id"
              :options="object.options"
              v-model="innerPageValue.inputs[object.id].value"
              option-label="label"
              option-value="value"
              class="w-full"
              multiple
            />
            <Listbox
              v-if="object.type === 'list' && object.options"
              :key="object.id"
              :options="object.options"
              v-model="innerPageValue.inputs[object.id].value"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              multiple
            />

            <!-- std. inputs -->
            <InputText
              v-if="object.type === 'text'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
              class="w-full"
            />
            <InputNumber
              v-if="object.type === 'number'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
              class="w-full"
            />
            <Textarea
              v-if="object.type === 'textarea'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
              class="w-full"
            />

            <!-- binary options -->
            <Checkbox
              v-if="object.type === 'checkbox'"
              :key="object.id"
              :label="object.label"
              :binary="true"
              v-model="<any>innerPageValue.inputs[object.id].value"
            />
            <ToggleButton
              v-if="object.type === 'toggle'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
            />
            <InputSwitch
              v-if="object.type === 'switch'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
            />

            <!-- radio options -->
            <template v-if="object.type === 'radioimage' && object.options">
            </template>
            <template v-if="object.type === 'radio' && object.options">
              <div
                v-for="option in object.options"
                :key="option.value"
                class="flex align-items-center"
              >
                <RadioButton
                  class="mt-3"
                  :inputId="object.id + '_' + option.value"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  v-model="innerPageValue.inputs[object.id].value"
                />
                <label class="mt-3 ml-2" :for="object.id + '_' + option.value">
                  {{ option.label }}
                </label>
              </div>
            </template>

            <!-- rating -->
            <Rating
              v-if="object.type === 'rating'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
              :cancel="false"
            />

            <!-- slider -->
            <Slider
              v-if="object.type === 'slider'"
              :key="object.id"
              :label="object.label"
              v-model="<any>innerPageValue.inputs[object.id].value"
              class="w-full"
            />
          </template>
        </Card>
      </template>
    </template>
    <template #footer>
      <Button>Back</Button>
      <Button>Next</Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {
  FormResult,
  FormPageObject,
  PageResult,
} from '@/types/index';
import { Ref, defineProps, ref } from 'vue';

const props = defineProps<{
  page: FormPageObject;
}>();

const getEmptyValueForType = (
  type: FormResult['type'],
): FormResult['value'] => {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    default:
      return '';
  }
};

// build an object with all pageId's as keys. The values will be from type PageResult
const innerPageValue: Ref<PageResult> = ref({
  id: props.page.id,
  name: props.page.name,
  inputs: props.page.form.reduce(
    (acc, object) => {
      acc[object.id] = {
        id: object.id,
        name: object.name,
        type: object.resultType,
        value: getEmptyValueForType(object.resultType) as any,
      };
      return acc;
    },
    {} as { [objectId: string]: FormResult },
  ),
});
</script>
