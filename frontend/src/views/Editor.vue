<template>
  <ConfirmPopup />

  <!-- Dialog to add a new Form -->
  <Dialog
    v-model:visible="showNewFormDialog"
    modal
    header="Create New Form/Survey"
    class="md:w-6 h-screen md:h-auto"
  >
    <Button
      v-if="aiServicesAvailable && !aiPromptVisible"
      class="mb-5 w-full"
      label="Use AI to generate a form"
      icon="fa-solid fa-robot"
      @click="aiPromptVisible = true"
    />
    <template v-if="aiPromptVisible">
      <FormField
        label="What would you like to do? (Aks the AI)"
        v-model="usersPrompt"
        longtext
        :disabled="loading"
      />
      <div class="flex justify-content-end mt-2">
        <Button
          :disabled="usersPrompt.length < 10 || loading"
          label="Generate Form"
          icon="fa-solid fa-robot"
          @click="getAIForm()"
        />
      </div>
    </template>
    <template v-else>
      <span class="p-text-secondary block mb-5"
        >Please fill in the needed information. This can be changed later.</span
      >
      <FormField
        label="Header for the Form"
        v-model="newElement.name"
        class="mb-5"
      />
      <FormField
        label="Description"
        v-model="newElement.description"
        longtext
        class="mb-5"
      />
      <div class="flex flex-column gap-3 mb-5">
        <label for="new-description"> Use a template? </label>
        <Dropdown
          class="flex-auto"
          v-model="newElement.template"
          :options="FORM_TEMPLATES"
          option-label="templateName"
          @change="
            newElement.template
              ? (newElement.name = newElement.template.templateName)
              : null;
            newElement.template
              ? (newElement.description = newElement.template.description)
              : null;
          "
        />
      </div>
      <div class="flex flex-column gap-1 mb-5">
        <label> Load a existing Config from URL </label>
        <InputText
          placeholder="Load from URL"
          v-model="loadFromUrl"
          class="flex-auto"
        />
        <Button
          :disabled="loadFromUrl === ''"
          type="button"
          label="Load"
          icon="fa-solid fa-cloud"
          @click="loadConfigFromUrl()"
        />
      </div>
      <div class="flex flex-column">
        <label for="new-description" class="font-semibold">
          Upload existing config file (.json)
        </label>
        <FileUpload
          class="w-full mt-2"
          accept=".json"
          customUpload
          @uploader="uploadJsonFile($event)"
          mode="basic"
          :auto="true"
        >
        </FileUpload>
      </div>

      <div class="flex justify-content-end gap-2 mt-5">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="showNewFormDialog = false"
        ></Button>
        <Button
          type="button"
          label="Start Editing"
          @click="
            activeConfig = getEmptyFormConfig(newElement);
            activePage = Object.keys(activeConfig.pages)[0];
            showNewFormDialog = false;
            reset();
          "
        ></Button>
      </div>
    </template>
  </Dialog>

  <!-- Dialog to add a new Form -->
  <Dialog
    v-model:visible="showGenerateUrlDialog"
    modal
    header="Generate URL to use the Form"
    class="w-full md:w-6 h-screen md:h-auto"
  >
    <span>
      The URL to your config file.<br />
      (needs to be public)
    </span>
    <FormField label="Your URL (https://...)" v-model="userUrl" class="mt-5" />
    <div class="mt-5">
      <span v-if="generatedUrl !== ''">
        Copied to clipboard:
        {{ generatedUrl }}
      </span>
    </div>
    <div class="flex justify-content-center mt-5 gap-3">
      <Button
        type="button"
        label="Generate and Copy URL"
        severity="secondary"
        @click="generateUrl()"
        icon="fa-solid fa-copy"
      />
      <Button
        type="button"
        label="Ok"
        severity="secondary"
        @click="showGenerateUrlDialog = false"
      />
    </div>
  </Dialog>

  <!-- Main Top-Toolbar -->
  <Toolbar>
    <template #start>
      <div class="hidden md:flex md:align-items-center md:gap-2">
        <img src="/logo.webp" alt="logo" style="height: 50px" />
        <div>
          <h2 class="mb-0 mt-0">CodeForms</h2>
          <span class="p-text-secondary">
            The free and Open-Source Form Editor
          </span>
        </div>
      </div>
    </template>
    <template #end>
      <div class="flex">
        <ToggleButton
          class="hidden md:block"
          v-model="showHelp"
          onIcon="fa-solid fa-eye"
          offIcon="fa-solid fa-eye-slash"
          on-label="Hide Help"
          off-label="Show Help"
        />
        <ToggleButton
          class="block md:hidden"
          v-model="showHelp"
          onIcon="fa-solid fa-question"
          offIcon="fa-solid fa-question"
          on-label=""
          off-label=""
        />
      </div>
      <Button
        icon="fa-solid fa-plus"
        class="ml-2"
        @click="
          showNewFormDialog = true;
          aiPromptVisible = false;
        "
        label="New Form"
      />
      <Button
        class="ml-3"
        icon="fa-solid fa-cog"
        @click="showGeneralConfig = true"
        rounded
        severity="secondary"
      />
    </template>
  </Toolbar>

  <!-- General Config Sidebar -->
  <Sidebar
    v-model:visible="showGeneralConfig"
    header="General configuration"
    position="right"
    class="sm:w-full md:w-7"
  >
    <div class="flex flex-column h-full">
      <div class="overflow-y-auto">
        <TabView>
          <TabPanel header="General">
            <div class="flex flex-column gap-3">
              <InlineMessage severity="info" class="mb-3" v-if="showHelp">
                The header is the name of the form/survey. The description will
                be shown below. You can hide this if you want.
              </InlineMessage>
              <FormField label="Header (Name)" v-model="activeConfig.name" />
              <FormField
                label="Description"
                v-model="activeConfig.description"
                longtext
              />
              <FormCheckbox
                label="Show global name and description?"
                v-model="activeConfig.style.showNameAndDescription"
              />
              <FormCheckbox
                v-if="activeConfig.style.showNameAndDescription"
                label="Show on all pages?"
                v-model="activeConfig.style.showNameAndDescriptionOnEveryPage"
              />
              <ToggleButton
                v-model="showConditionalLogic"
                on-label="Show Page Editor"
                off-label="Show Conditional Logic"
                onIcon="fa-solid fa-file"
                offIcon="fa-solid fa-code"
              />
            </div>
          </TabPanel>
          <TabPanel header="Pages">
            <InlineMessage severity="info" class="mb-3" v-if="showHelp">
              You can add multiple pages to your form. This can be useful if you
              want to split your form into multiple steps.
            </InlineMessage>
            <div class="flex flex-column gap-3">
              <!-- acticve page -->
              <FormField
                label="Name of the active page"
                v-model="activeConfig.pages[activePage].name"
              />
              <FormField
                label="Description of the active page"
                v-model="activeConfig.pages[activePage].description"
                longtext
              />

              <Button
                label="Add new Page"
                icon="fa-solid fa-plus"
                @click="addPage()"
              />
              <div class="flex flex-column gap-2">
                <div
                  v-for="page in Object.keys(activeConfig.pages)"
                  :key="page"
                  class="border-1 p-2 surface-border"
                >
                  <div
                    class="flex align-items-center gap-3 mt-2 cursor-pointer"
                    @click="activePage = page"
                  >
                    <div
                      class="border-round border-1 border-300"
                      style="width: 25px; height: 25px"
                      :class="
                        activePage === page ? 'bg-primary' : 'bg-secondary'
                      "
                    >
                      <i
                        :class="`fa-solid ${
                          activePage === page ? 'fa-check' : ''
                        } m-0 p-1`"
                      ></i>
                    </div>
                    <span class="flex-auto font-bold">
                      {{
                        activeConfig.pages[page].name === ''
                          ? 'Page without name'
                          : activeConfig.pages[page].name
                      }}
                    </span>
                    <Button
                      v-if="Object.keys(activeConfig.pages).length > 1"
                      icon="fa-solid fa-trash"
                      @click="dropPage($event, page)"
                      class="p-button-warning"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Deploy your Form">
            <div class="flex flex-column gap-3">
              <InlineMessage severity="info" class="mb-3" v-if="showHelp">
                You can download the actual configuration as a JSON file. You
                need to place this file on a public server and get its public
                URL. This URL will be set in the "url" parameter to use this
                form on your website.
              </InlineMessage>
              <FormField
                label="Target-URL (for the POST)"
                v-model="activeConfig.target.url"
              />
              <Chip
                v-if="generatedUrl !== ''"
                @click="generateUrl()"
                class="cursor-pointer"
              >
                URL to use the form on your website (click to copy):<br />
                {{ generatedUrl }}
              </Chip>
              <Button
                v-if="backendUrl !== ''"
                label="Save and deploy your Config"
                icon="fa-solid fa-save"
                @click="saveInCloud()"
              />
              <Button
                label="Download Config"
                icon="fa-solid fa-download"
                @click="downloadJsonFile()"
              />
              <Button
                label="Generate URL for Form"
                icon="fa-solid fa-copy"
                @click="
                  generatedUrl = '';
                  showGenerateUrlDialog = true;
                "
              />
            </div>
          </TabPanel>
        </TabView>
      </div>
      <!-- <div class="mt-auto">
        <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
        FOOTER
      </div> -->
    </div>
  </Sidebar>

  <!-- Add item sidebar -->
  <Sidebar
    v-model:visible="showAddItemSidebar"
    header="Add new Input Element"
    position="left"
    class="sm:w-full md:w-7"
  >
    <div class="flex flex-column h-full">
      <div class="overflow-y-auto">
        <InlineMessage severity="info" class="mb-3" v-if="showHelp">
          Decide what kind of input element you want to add to your form and
          press the "+" button to add it into the editor.
        </InlineMessage>
        <AddItemChooser
          v-for="item in possibleItems"
          :label="item.label"
          :type="item.type"
          @update:trigger="
            showAddItemSidebar = false;
            addItem(item.type as FormType);
          "
          :icon="item.icon"
        />
      </div>
    </div>
  </Sidebar>

  <div
    v-if="!showConditionalLogic"
    style="height: calc(100vh - 95px); overflow-y: scroll"
  >
    <Card
      class="m-auto sm:w-full md:w-8 mt-5"
      v-if="activeConfig.style.showNameAndDescription"
    >
      <template #title>
        <h1>{{ activeConfig.name }}</h1>
      </template>
      <template #content>
        {{ activeConfig.description }}
      </template>
    </Card>

    <Card
      v-if="activeConfig.pages[activePage]"
      class="m-auto sm:w-full md:w-8 mt-5"
    >
      <template #title>
        {{ activeConfig.pages[activePage].name }}
      </template>
      <template #subtitle>
        {{ activeConfig.pages[activePage].description }}
      </template>
      <template #content>
        <Button
          v-if="activeConfig.pages[activePage].form.length === 0"
          style="left: 10px; top: 0px"
          @click="
            showAddItemSidebar = true;
            indexToAddObject = -1;
          "
          icon="fa-solid fa-add"
          rounded
        />

        <div class="flex flex-column gap-2">
          <ItemPreview
            v-for="object in activeConfig.pages[activePage].form"
            :key="object.id"
            :object="object"
            @update:action="appendActionToItem($event, object.id)"
          />
        </div>
      </template>
    </Card>
  </div>

  <div
    v-if="showConditionalLogic"
    style="height: calc(100vh - 95px); overflow-y: scroll"
  >
    <Card class="m-auto sm:w-full md:w-8 mt-5">
      <template #title>
        <h3>Conditional Logic for the Form</h3>
      </template>
      <template #content>
        <ConditionalLogicEditor
          v-model:start-page="activeConfig.startPageId"
          :pages="activeConfig.pages"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// Editor specific imports
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Sidebar from 'primevue/sidebar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import ConfirmPopup from 'primevue/confirmpopup';
import Chip from 'primevue/chip';

import FormField from '@components/editor/FormField.vue';
import FormCheckbox from '@components/editor/FormCheckbox.vue';
import AddItemChooser from '@components/editor/AddItemChooser.vue';

import { Ref, ref, onBeforeMount } from 'vue';
import { FormConfig, FormType, SimpleTemplate } from '@/types/index';
import { validateFormConfig } from '@/services/validator';
import { getEmptyFormConfig, getEmptyPageObject } from '@/services/general';
import { getEmptyFormObject } from '@/services/general';
import ItemPreview from '@components/editor/ItemPreview.vue';
import { FORM_TEMPLATES } from '@/services/templates';
import { error, info } from '@/services/toast';
import { useConfirm } from 'primevue/useconfirm';
import ConditionalLogicEditor from '@components/editor/ConditionalLogicEditor.vue';
import { aiIsAvailable, getAiDrivenFormConfig } from '@/services/aiservice';

const confirm = useConfirm();

/**
 * Add and show new form dialog
 */
const showHelp = ref(false);
const showNewFormDialog = ref(false);
const newElement = ref({
  name: '',
  description: '',
  template: null as SimpleTemplate | null,
});
const activeConfig: Ref<FormConfig> = ref(
  getEmptyFormConfig({
    name: 'Hey, welcome to your Form!',
    description: 'Please help us with the following questions. Thank you!',
    template: null,
  }),
);
const activePage: Ref<string> = ref(
  activeConfig.value.pages[Object.keys(activeConfig.value.pages)[0]].id,
);
const reset = () => {
  newElement.value = {
    name: '',
    description: '',
    template: null,
  };
};

/**
 * General config
 */
const showGeneralConfig = ref(false);

/**
 * Add item
 */
const possibleItems = [
  {
    label: 'Dropdown (one Choice)',
    type: 'dropdown',
    icon: 'fa-solid fa-list',
  },
  {
    label: 'Text',
    type: 'text',
    icon: 'fa-solid fa-font',
  },
  {
    label: 'Textarea',
    type: 'textarea',
    icon: 'fa-solid fa-font',
  },
  {
    label: 'Number',
    type: 'number',
    icon: 'fa-solid fa-0',
  },
  {
    label: 'Checkbox',
    type: 'checkbox',
    icon: 'fa-solid fa-check-square',
  },
  {
    label: 'Switch',
    type: 'switch',
    icon: 'fa-solid fa-toggle-on',
  },
  {
    label: 'Toggle',
    type: 'toggle',
    icon: 'fa-solid fa-stop',
  },
  {
    label: 'List',
    type: 'list',
    icon: 'fa-solid fa-list',
  },
  {
    label: 'Multiselect',
    type: 'multiselect',
    icon: 'fa-solid fa-list',
  },
  {
    label: 'Radio',
    type: 'radio',
    icon: 'fa-solid fa-circle-dot',
  },
  {
    label: 'Radio Image',
    type: 'radioimage',
    icon: 'fa-solid fa-circle-dot',
  },
  {
    label: 'Rating',
    type: 'rating',
    icon: 'fa-solid fa-star',
  },
  {
    label: 'Slider',
    type: 'slider',
    icon: 'fa-solid fa-sliders',
  },
];

const showAddItemSidebar = ref(false);
const indexToAddObject = ref(-1);
const addItem = (type: FormType) => {
  if (indexToAddObject.value === -1) {
    activeConfig.value.pages[activePage.value]?.form.push(
      getEmptyFormObject(type),
    );
  } else {
    activeConfig.value.pages[activePage.value]?.form.splice(
      indexToAddObject.value + 1,
      0,
      getEmptyFormObject(type),
    );
  }
};

/**
 * Drop a page from the form
 */
const dropPage = (event: any, pageId: string) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to drop the page?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      delete activeConfig.value.pages[pageId];
      activePage.value = Object.keys(activeConfig.value.pages)[0];
    },
  });
};

/**
 * Add a new page to the form
 */
const addPage = () => {
  const newPage = getEmptyPageObject();
  activeConfig.value.pages[newPage.id] = newPage;
  activePage.value = newPage.id;
};

/**
 * Append an action to an item
 */
const appendActionToItem = (
  action: 'move-up' | 'move-down' | 'add' | 'drop',
  itemId: string,
) => {
  const item = activeConfig.value.pages[activePage.value].form.find(
    (i) => i.id === itemId,
  );
  if (item) {
    switch (action) {
      case 'move-up':
        const index =
          activeConfig.value.pages[activePage.value].form.indexOf(item);
        if (index > 0) {
          activeConfig.value.pages[activePage.value].form.splice(
            index - 1,
            0,
            activeConfig.value.pages[activePage.value].form.splice(index, 1)[0],
          );
        }
        break;
      case 'move-down':
        const index2 =
          activeConfig.value.pages[activePage.value].form.indexOf(item);
        if (
          index2 <
          activeConfig.value.pages[activePage.value].form.length - 1
        ) {
          activeConfig.value.pages[activePage.value].form.splice(
            index2 + 1,
            0,
            activeConfig.value.pages[activePage.value].form.splice(
              index2,
              1,
            )[0],
          );
        }
        break;
      case 'add':
        indexToAddObject.value = activeConfig.value.pages[
          activePage.value
        ].form.findIndex((i) => i.id === itemId);
        showAddItemSidebar.value = true;
        break;
      case 'drop':
        activeConfig.value.pages[activePage.value].form =
          activeConfig.value.pages[activePage.value].form.filter(
            (i) => i.id !== itemId,
          );
        break;
    }
  }
};

/**
 * Upload a JSON file and parse it to a form config
 */
const uploadJsonFile = (event: any) => {
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = (e: any) => {
    try {
      const result = e.target.result;
      const json = JSON.parse(result as string);
      validateFormConfig(json);
      activeConfig.value = json;
      if (Object.keys(activeConfig.value.pages).length === 0) return;
      activePage.value = Object.keys(activeConfig.value.pages)[0];
      showNewFormDialog.value = false;
    } catch (e) {
      console.error(e);
      error('Error while parsing the JSON file');
    }
  };
  reader.readAsText(file);
};

/**
 * Take the actual FormConfig and save it to a JSON file and download it
 * The name of the file will be the name of the form
 */
const downloadJsonFile = () => {
  const data = JSON.stringify(activeConfig.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = activeConfig.value.name + '.json';
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Generate a URL for the form.
 * This will create URL from the actual base URL + the given url from input
 */
const showGenerateUrlDialog = ref(false);
const userUrl = ref('');
const generatedUrl = ref('');
const generateUrl = () => {
  showGenerateUrlDialog.value = false;
  generatedUrl.value = `${window.location.href.replace(
    '/#/editor',
    '',
  )}?url=${encodeURIComponent(userUrl.value)}`;
  // copy to clipboard
  const el = document.createElement('textarea');
  el.value = generatedUrl.value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  return generatedUrl.value;
};

/**
 * Load a config from a given URL
 */
const loadFromUrl = ref('');
const loadConfigFromUrl = async () => {
  loading.value = true;

  try {
    const res = await fetch(loadFromUrl.value);
    const json = await res.json();
    validateFormConfig(json);
    activeConfig.value = json;
    if (Object.keys(activeConfig.value.pages).length === 0) return;
    activePage.value = Object.keys(activeConfig.value.pages)[0];
    showNewFormDialog.value = false;
  } catch (e) {
    console.error(e);
    error('Error while loading the form from the given URL');
  }

  loading.value = false;
  loadFromUrl.value = '';
};

/**
 * Save the actual form config in the cloud
 */
const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
const saveInCloud = async () => {
  try {
    const res = await fetch(`${backendUrl}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activeConfig.value),
    });
    const resJson = await res.json();
    userUrl.value = resJson.url;
    const url = generateUrl();
    info(
      'Form saved in the cloud. URL was copied to clipboard. ' + url,
      'Success',
      5000,
    );
  } catch (e) {
    console.error(e);
    error('Error while saving the form in the cloud.');
  }
};

/**
 * Conditional logic
 */
const showConditionalLogic = ref(false);

/**
 * Prevent the User to reload the page while editing
 */
onBeforeMount(() => {
  if (import.meta.env.MODE !== 'development') {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });
  }
});

/**
 * AI services
 */
const aiServicesAvailable = ref(aiIsAvailable());
const aiPromptVisible = ref(false);
const usersPrompt = ref('');
const loading = ref(false);
const getAIForm = async () => {
  loading.value = true;
  const form = await getAiDrivenFormConfig(usersPrompt.value);
  console.log(form);

  if (Object.keys(activeConfig.value.pages).length === 0) return;
  activeConfig.value = form;
  activePage.value = Object.keys(activeConfig.value.pages)[0];

  loading.value = false;
  showNewFormDialog.value = false;
};
</script>
