<template>
  <Card class="border-round-sm mb-2" v-if="object">
    <template #subtitle>
      <span v-if="!editMode" class="cursor-pointer" @click="editMode = true">
        {{ object.label }}{{ object.required ? '*' : '' }}
        <i class="fa-solid fa-pen ml-0 text-sm"></i>
      </span>
      <div v-else>
        <span class="w-full flex">
          <InputText
            v-model="object.label"
            @blur="editMode = false"
            class="flex-grow-1"
          />
          <i
            class="fa-solid fa-check text-2xl cursor-pointer ml-2 mt-1 mr-2"
            @click="editMode = false"
          />
        </span>
        <span class="text-sm">
          <FormField
            label="Data-Name in submit"
            v-model="object.name"
            class="mt-3"
          />
        </span>
      </div>
    </template>
    <template #content>
      <template v-if="!editMode">
        <!-- multipe inputs -->
        <Dropdown
          v-if="object.type === 'dropdown' && object.options"
          :key="object.id"
          :options="object.options"
          v-model="dummyValues[object.id]"
          option-label="label"
          option-value="value"
          class="w-full"
          multiple
          :disabled="true"
        />
        <Listbox
          v-if="object.type === 'list' && object.options"
          :key="object.id"
          :options="object.options"
          v-model="dummyValues[object.id]"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          multiple
          :disabled="true"
        />

        <!-- std. inputs -->
        <InputText
          v-if="object.type === 'text'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          :disabled="true"
        />
        <InputNumber
          v-if="object.type === 'number'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          :disabled="true"
        />
        <Textarea
          v-if="object.type === 'textarea'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          :disabled="true"
        />

        <!-- binary options -->
        <Checkbox
          v-if="object.type === 'checkbox'"
          :key="object.id"
          :label="object.label"
          :binary="true"
          v-model="<any>dummyValues[object.id]"
          :disabled="true"
        />
        <ToggleButton
          v-if="object.type === 'toggle'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          :disabled="true"
        />
        <InputSwitch
          v-if="object.type === 'switch'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          :disabled="true"
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
              v-model="dummyValues[object.id]"
              :disabled="true"
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
          v-model="<any>dummyValues[object.id]"
          :cancel="false"
          :disabled="true"
        />

        <!-- slider -->
        <Slider
          v-if="object.type === 'slider'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          :disabled="true"
        />
        <Calendar
          v-if="object.type === 'date'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          autocomplete="off"
          :disabled="true"
        />
        <Calendar
          v-if="object.type === 'time'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          autocomplete="off"
          timeOnly
          :disabled="true"
        />
        <Calendar
          v-if="object.type === 'datetime'"
          :key="object.id"
          :label="object.label"
          v-model="<any>dummyValues[object.id]"
          class="w-full"
          autocomplete="off"
          showTime
          hourFormat="24"
          :disabled="true"
        />
      </template>

      <!-- Edit options if it has some -->
      <template v-if="object.options && editMode">
        <div class="mt-3">
          <Button
            icon="fa-solid fa-add"
            label="Add Option"
            class="w-full"
            @click="object.options.push({ label: '', value: '' })"
          />
        </div>
        <!-- list of text inputs for each input -->
        <div class="mt-3">
          <FormFieldTwoCol
            v-for="option in object.options"
            v-model:value1="option.label"
            v-model:value2="option.value"
            labelCol1="Label"
            labelCol2="Value"
            class="w-full"
          />
        </div>
      </template>
    </template>
    <template #footer>
      <div class="flex justify-content-center align-items-center">
        <Button
          class="mr-3"
          style="width: 20px; height: 20px"
          icon="fa-solid fa-chevron-up"
          @click="emit('update:action', 'move-up')"
          rounded
          severity="secondary"
        />
        <Button
          class="ml-1 mr-1"
          style="width: 30px; height: 30px"
          icon="fa-solid fa-add"
          @click="emit('update:action', 'add')"
          rounded
          severity="contrast"
        />
        <Button
          class="ml-1 mr-1"
          style="width: 20px; height: 20px"
          icon="fa-solid fa-xmark"
          @click="emit('update:action', 'drop')"
          rounded
          severity="danger"
        />
        <Button
          class="ml-3"
          style="width: 20px; height: 20px"
          icon="fa-solid fa-chevron-down"
          @click="emit('update:action', 'move-down')"
          rounded
          severity="secondary"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { FormObject } from '@/types';
import { Ref, ref } from 'vue';
import FormField from './FormField.vue';
import FormFieldTwoCol from './FormFieldTwoCol.vue';

const editMode = ref(false);

defineProps<{
  object: FormObject;
}>();

const dummyValues: Ref<{ [id: string]: any }> = ref({});

const emit = defineEmits(['update:trigger', 'update:action']);
</script>
