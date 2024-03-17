<template>
  <div class="flex flex-column">
    <!-- Dropdown to choose the Start-Page -->
    <div class="field">
      <label for="choose-start-page">Choose Start-Page</label>
      <Dropdown
        class="w-full"
        id="choose-start-page"
        :options="pageSelection"
        option-label="name"
        option-value="id"
        v-model="_startPage"
        @change="emit('update:startPage', _startPage)"
      />
    </div>

    <!-- Conditional Logic Editor -->
    <!-- Logic can only be edited for one page at the same time -->
    <div class="field">
      <label for="choose-actual-page">Choose actual Page</label>
      <Dropdown
        class="w-full"
        id="choose-actual-page"
        :options="pageSelection"
        option-label="name"
        v-model="activePage"
        @change="emit('update:startPage', _startPage)"
      />
    </div>

    <!-- Rules for the selected page -->
    <div v-if="activePage">
      <div class="flex flex-column gap-2">
        <h3>Navigation Rules</h3>
        <InlineMessage severity="info">
          Define the rules for the selected page to navigate to the next page.
          First the Form will check all required fields. If all required fields
          match the rules will be checked. If a rule matches the next page will
          be shown. Attention. If you have multiple rules, the first matching
          rule will be used to determine the next page.
        </InlineMessage>
        <Button
          :disabled="activePage.form.length < 1"
          label="Add rule"
          icon="fa-solid fa-plus"
          class="w-full"
          @click="addEmptyNavigationRule()"
        />
        <InlineMessage severity="warn" v-if="activePage.form.length < 1">
          You need to add at least one form object to the page to add a
          navigation rule.
        </InlineMessage>
      </div>
      <div class="flex flex-column" v-for="rule in activePage.navigationRules">
        <div class="grid m-2 border-1 surface-border border-round">
          <div class="col-12 mt-2">
            <label for="choose-object">Input</label>
            <Dropdown
              class="w-full"
              id="choose-object"
              :options="activePage.form"
              option-label="label"
              option-value="id"
              v-model="rule.condition.objectId"
              @change="updateDefaultValueByType(rule)"
            />
          </div>
          <div class="col-4 mt-2">
            <label for="choose-operator">Operator</label>
            <Dropdown
              class="w-full"
              id="choose-operator"
              :options="operatorOptions"
              v-model="rule.condition.operator"
            />
          </div>
          <div class="col-8 mt-2">
            <label for="choose-value">Value</label>
            <InputText
              v-if="
                getResultTypeFromObject(rule.condition.objectId) === 'string'
              "
              class="w-full"
              id="choose-value"
              v-model="<string>rule.condition.value"
            />
            <InputNumber
              v-else-if="
                getResultTypeFromObject(rule.condition.objectId) === 'number'
              "
              class="w-full"
              id="choose-value"
              v-model="<number>rule.condition.value"
            />
            <Checkbox
              v-else-if="
                getResultTypeFromObject(rule.condition.objectId) === 'boolean'
              "
              class="w-full"
              id="choose-value"
              v-model="<boolean>rule.condition.value"
              :binary="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ConditionOperator,
  FormConfig,
  FormPageObject,
  NavigationRule,
  PossibleResultType,
} from '@/types';
import { ref, computed, watch } from 'vue';

/**
 * Component inputs and outputs
 */
const props = defineProps<{
  pages: FormConfig['pages'];
  startPage: string;
}>();
const emit = defineEmits(['update:startPage']);

/**
 * Component state
 */
const pageSelection = computed(() => {
  const items: FormPageObject[] = [];
  for (const page in props.pages) {
    items.push(props.pages[page]);
  }
  return items;
});
const _startPage = ref(props.startPage);
const activePage = ref(pageSelection.value[0]);

watch(
  () => props.pages,
  () => {
    _startPage.value = props.startPage;
    activePage.value = pageSelection.value[0];
  },
);

/**
 * Conditional Logic
 */
const operatorOptions: ConditionOperator[] = [
  '==',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  'contains',
];

/**
 * Get the resultType from an object
 */
const getResultTypeFromObject = (id: string): PossibleResultType | '' => {
  const object = activePage.value.form.find((obj) => obj.id === id);
  return object?.resultType ?? '';
};
const updateDefaultValueByType = (rule: NavigationRule) => {
  const object = activePage.value.form.find(
    (obj) => obj.id === rule.condition.objectId,
  );
  if (object) {
    if (object.resultType === 'boolean') {
      rule.condition.value = false;
    } else if (object.resultType === 'number') {
      rule.condition.value = 0;
    } else if (object.resultType === 'array') {
      rule.condition.value = [];
    } else {
      rule.condition.value = '';
    }
  }
};

/**
 * Add an empty navigation rule to the active page
 */
const addEmptyNavigationRule = () => {
  if (activePage.value.navigationRules) {
    activePage.value.navigationRules.push({
      toPageId: '',
      condition: {
        objectId: '',
        operator: '==',
        value: '',
        valueType: 'string',
      },
    });
  } else {
    activePage.value.navigationRules = [
      {
        toPageId: '',
        condition: {
          objectId: '',
          operator: '==',
          value: '',
          valueType: 'string',
        },
      },
    ];
  }
};
</script>
