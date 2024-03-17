import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';

/* PrimeVue components */
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import ProgressSpinner from 'primevue/progressspinner';
import Toolbar from 'primevue/toolbar';
import Calendar from 'primevue/calendar';
import Slider from 'primevue/slider';
import InlineMessage from 'primevue/inlinemessage';
import InputSwitch from 'primevue/inputswitch';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import ToggleButton from 'primevue/togglebutton';
import Listbox from 'primevue/listbox';
import ProgressBar from 'primevue/progressbar';
import SelectButton from 'primevue/selectbutton';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'primeflex/primeflex.css';

export const app = createApp(App)  
  .use(PrimeVue)
  .use(ToastService)
  .use(ConfirmationService)
  .use(router);

app.component('MultiSelect', MultiSelect);
app.component('Button', Button);
app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Toolbar', Toolbar);
app.component('InlineMessage', InlineMessage);
app.component('Calendar', Calendar);
app.component('Slider', Slider);
app.component('InputSwitch', InputSwitch);
app.component('Divider', Divider);
app.component('Toast', Toast);
app.component('ToggleButton', ToggleButton);
app.component('Listbox', Listbox);
app.component('ProgressBar', ProgressBar);
app.component('SelectButton', SelectButton);
app.component('Rating', Rating);
app.component('RadioButton', RadioButton);

app.mount('#app');
