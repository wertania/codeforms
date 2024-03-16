<template>
  <ConfirmPopup />

  <!-- Dialog to add a new Form -->
  <Dialog
    v-model:visible="showNewFormDialog"
    modal
    header="Create New Form/Survey"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary block mb-5"
      >Please fill in the needed information. This can be changed later.</span
    >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="new-name" class="font-semibold w-6rem"> Header </label>
      <InputText
        id="new-name"
        class="flex-auto"
        autocomplete="off"
        v-model="newElement.name"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="new-description" class="font-semibold w-6rem"
        >Description
      </label>
      <InputText
        id="new-description"
        class="flex-auto"
        autocomplete="off"
        v-model="newElement.description"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="new-description" class="font-semibold w-6rem">
        Use a template?
      </label>
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
  </Dialog>

  <!-- Main Top-Toolbar -->
  <Toolbar>
    <template #start>
      <div class="flex align-items-center gap-2">
        <img src="/logo.webp" alt="logo" style="height: 50px" />
        <div>
          <h2 class="mb-0 mt-0">Formy</h2>
          <span class="p-text-secondary">
            The free and Open-Source Form Editor
          </span>
        </div>
      </div>
    </template>
    <template #end>
      <div class="flex">
        <ToggleButton
          v-model="showHelp"
          onIcon="fa-solid fa-eye"
          offIcon="fa-solid fa-eye-slash"
          on-label="Hide Help"
          off-label="Show Help"
        />
      </div>
      <Button
        icon="fa-solid fa-plus"
        class="ml-2"
        @click="showNewFormDialog = true"
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
    style="width: 40%"
  >
    <div class="flex flex-column h-full">
      <div class="overflow-y-auto">
        <TabView>
          <TabPanel header="General">
            <InlineMessage severity="info" class="mb-3" v-if="showHelp">
              The header is the name of the form/survey. The description will be
              shown below. You can hide this if you want.
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
            <InlineMessage severity="info" class="mb-3" v-if="showHelp">
              The target URL is the URL where the form data will be sent to.
            </InlineMessage>
            <FormField
              label="Target-URL (for the POST)"
              v-model="activeConfig.target.url"
            />
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
          <TabPanel header="Export/Download">
            <div class="flex flex-column gap-3">
              <InlineMessage severity="info" class="mb-3" v-if="showHelp">
                You can download the actual configuration as a JSON file. You
                need to place this file on a public server and get its public
                URL. This URL will be set in the "url" parameter to use this
                form on your website.
              </InlineMessage>
              <Button
                label="Download Config"
                icon="fa-solid fa-download"
                @click="downloadJsonFile()"
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
    style="width: 40%"
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

  <div style="height: calc(100vh - 95px)">
    <Card
      class="m-auto w-8 mt-5"
      v-if="activeConfig.style.showNameAndDescription"
    >
      <template #title>
        <h1>{{ activeConfig.name }}</h1>
      </template>
      <template #content>
        {{ activeConfig.description }}
      </template>
    </Card>

    <Button
      style="left: 10px; top: 10px"
      @click="showAddItemSidebar = true"
      icon="fa-solid fa-add"
      rounded
    />
    <Card v-if="activeConfig.pages[activePage]" class="m-auto w-8 mt-5">
      <template #title>
        {{ activeConfig.pages[activePage].name }}
      </template>
      <template #subtitle>
        {{ activeConfig.pages[activePage].description }}
      </template>
      <template #content>
        <div class="flex flex-column gap-2">
          <ItemPreview
            v-for="object in activeConfig.pages[activePage].form"
            :key="object.id"
            :object="object"
          />
        </div>
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

import FormField from '@components/editor/FormField.vue';
import FormCheckbox from '@components/editor/FormCheckbox.vue';
import AddItemChooser from '@components/editor/AddItemChooser.vue';

import { Ref, ref } from 'vue';
import { FormConfig, FormType, SimpleTemplate } from '@/types/index';
import { validateFormConfig } from '@/services/validator';
import { getEmptyFormConfig, getEmptyPageObject } from '@/services/general';
import { getEmptyFormObject } from '@/services/general';
import ItemPreview from '@components/editor/ItemPreview.vue';
import { FORM_TEMPLATES } from '@/services/templates';
import { error } from '@/services/toast';
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

/**
 * Add and show new form dialog
 */
const showHelp = ref(false);
const showNewFormDialog = ref(false);
const newElement = ref({
  name: 'Hey, welcome to your Form!',
  description: 'Please help us with the following questions. Thank you!',
  template: null as SimpleTemplate | null,
});
const activeConfig: Ref<FormConfig> = ref(getEmptyFormConfig(newElement.value));
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
    type: 'text',
    icon: 'fa-solid fa-caret-down',
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
const addItem = (type: FormType) => {
  activeConfig.value.pages[activePage.value]?.form.push(
    getEmptyFormObject(
      type,
      Object.keys(activeConfig.value.pages[activePage.value].form).length,
    ),
  );
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
</script>
