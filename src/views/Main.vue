<template>
  <template v-if="activeForm">
    <Card
      class="m-auto w-8 mt-5"
      v-if="activeForm.style.showNameAndDescription"
    >
      <template #title>
        <h1>{{ activeForm.name }}</h1>
      </template>
      <template #content>
        {{ activeForm.description }}
      </template>
    </Card>

    <!-- The actual visible input -->
    <FormPage
      v-if="activeForm.pages[activePage]"
      :page="activeForm.pages[activePage]"
      @update:page-result="valueStore[activePage] = $event"
    >
      <template #navigation>
        <div class="flex justify-content-around flex-wrap">
          <Button
            v-if="activePage !== activeForm.startPageId"
            @click="false"
            :label="activeForm.style.previousButtonLabel ?? 'Previous'"
            :disabled="true"
            class="w-3"
          />
          <Button
            v-if="nextValidPage.id"
            @click="gotoPage(nextValidPage.id)"
            class="w-3"
            :label="activeForm.style.nextButtonLabel ?? 'Next'"
          />
          <Button
            v-if="nextValidPage.lastPage"
            @click="submit()"
            class="w-3"
            :label="activeForm.style.submitButtonLabel ?? 'Submit'"
          />
        </div>
      </template>
    </FormPage>
    <div v-else class="m-auto w-full md:w-7">
      <p>Error: The PageId {{ activePage }} was not found in configuration!</p>
    </div>
  </template>
  <template v-else>
    <p>Loading...</p>
  </template>
</template>

<script setup lang="ts">
import { ref, ComputedRef, computed, onMounted } from 'vue';
import FormPage from '@components/FormPage.vue';
import {
  FormPageObject,
  NextPageCondition,
  PageResult,
  FormConfig,
} from '@/types/index';
import { error } from '@/services/toast';
import { validateFormConfig } from '@/services/validator';

// Inner Form State
const activeForm = ref<FormConfig>();
// Inner pointer to the active page. Will be used to navigate through the form. Use the startPageId as default
const activePage = ref<string>('');
// Inner Form Result Store
const valueStore = ref<{ [pageId: string]: PageResult }>({});

/**
 * Try to parse the url parameter and return the needed parameters
 */
const parseUrlParmeter = (): {
  url: string;
} => {
  const url = new URLSearchParams(window.location.search).get('url');
  return { url: url ?? '' };
};

/**
 * Get the form configuration from an external source
 */
const getConfigFromExternal = async (url: string): Promise<FormConfig> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status + ' ' + response.body);
    return validateFormConfig((await response.json()) as FormConfig);
  } catch (e) {
    throw new Error('Error: ' + e);
  }
};

const init = async () => {
  const { url } = parseUrlParmeter();
  console.debug('get config', url);
  if (url === '') {
    error('No valid url found');
    return;
  }
  activeForm.value = await getConfigFromExternal(url);
  console.debug(JSON.stringify(activeForm.value, null, 2));
  activePage.value = activeForm.value.startPageId;
  valueStore.value = {
    [activePage.value]: {
      id: activePage.value,
      name: activeForm.value.pages[activePage.value].name,
      inputs: {},
    },
  };
};
// Change the active page
const gotoPage = (pageId: string) => {
  activePage.value = pageId;
};

/**
 * Calculate the next page id based on the current page and the current input values
 */
const evaluateCondition = (
  inputValue: string | number | boolean | string[],
  condition: NextPageCondition,
): boolean => {
  switch (condition.operator) {
    case '==':
      return inputValue == condition.value;
    case '!=':
      return inputValue != condition.value;
    case '>':
      return inputValue > condition.value;
    case '<':
      return inputValue < condition.value;
    case '>=':
      return inputValue >= condition.value;
    case '<=':
      return inputValue <= condition.value;
    case 'contains':
      return (inputValue as string[]).includes(condition.value as string);
    default:
      return false;
  }
};
const getNextPageId = (
  currentPage: FormPageObject,
  pageResults: PageResult,
): string | null => {
  if (!currentPage.navigationRules) return null;

  for (let rule of currentPage.navigationRules) {
    const condition = rule.condition;
    const inputValue = pageResults.inputs[condition.objectId]?.value;
    if (evaluateCondition(inputValue, condition)) {
      return rule.toPageId;
    }
  }
  return null; // If no conditions are met, return null or handle as needed
};
const checkAllRequired = (pageId: string): boolean => {
  if (!activeForm.value) return false;
  const page = activeForm.value.pages[pageId];
  if (!page) return false;
  for (let input of page.form) {
    if (input.required) {
      const obj = valueStore.value[pageId].inputs[input.id];
      if (obj.type === 'string' && obj.value === '') return false;
      if (obj.type === 'number' && isNaN(obj.value)) return false;
      if (obj.type === 'boolean' && obj.value === false) return false;
      if (obj.type === 'array' && obj.value.length === 0) return false;
    }
  }
  return true;
};

/**
 * Inner State that shows the next valid page id or null if there is no valid page
 */
const nextValidPage: ComputedRef<{ id: null | string; lastPage: boolean }> =
  computed(() => {
    if (!activeForm.value) return { id: null, lastPage: false };
    const currentPage = activeForm.value.pages[activePage.value];
    const lastPage =
      !currentPage.navigationRules && !currentPage.defaultNextPageId;

    // fail
    if (!currentPage) return { id: null, lastPage: false };

    // check all required fields
    const allRequired = checkAllRequired(activePage.value);

    // first check if all required fields are filled
    if (!allRequired) return { id: null, lastPage };

    // Get the next page id based on the current page and the current input values
    const nextConditionalPage = getNextPageId(
      currentPage,
      valueStore.value[activePage.value],
    );
    if (nextConditionalPage) return { id: nextConditionalPage, lastPage };

    // If not, return the default next page id is set
    if (currentPage.defaultNextPageId != null)
      return { id: currentPage.defaultNextPageId, lastPage };

    // In all other cases, return null
    return {
      id: null,
      lastPage,
    };
  });

/**
 * Submit the form
 */
const submit = async () => {
  if (!activeForm.value) return;
  console.debug('submit', valueStore.value);
  try {
    const response = await fetch(activeForm.value.target.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(valueStore.value),
    });
    if (response.ok) return;
    else {
      error('Error: ' + response.status + ', ' + response.body);
    }
  } catch (e) {
    error('Error: ' + evaluateCondition);
  }
};

onMounted(() => {
  init();
});
</script>
