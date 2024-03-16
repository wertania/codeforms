<template>
  <Card class="m-auto w-8 mt-5">
    <template #title>
      <h1>Welcome to Formy</h1>
    </template>
    <template #content>
      <p>Hey There! I´m Formy. Your personal form builder demo</p>
    </template>
  </Card>

  <!-- "Form" copmonent preview. will be refactored later -->
  <template v-for="page in myForm">
    <FormPage :page="page" v-if="activePage === page.id" />
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormPage from '@components/FormPage.vue';
import { FormPageObject } from '@/types/index';
import { getDemoData } from '@/services/demo';

// DEMO WITH ALL POSSIBLE INPUTS
const myForm = ref<FormPageObject[]>([getDemoData()]);

// build an object with all pageId's as keys. The values will be from type PageResult
const activePage = ref<null | string>(myForm.value[0].id);
</script>
