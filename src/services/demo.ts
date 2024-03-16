// import { FormConfig, FormPageObject } from "@/types"
// import { getGuid } from "./guid"

// const firstPageId = getGuid();
// const secondPageId = getGuid();
// const lastPageId = getGuid();
// const demoNameObjectId = getGuid();

// export const getDemoConfig = (): FormConfig => {
//     return {
//         id: getGuid(),
//         version: 1,
//         name: 'Formy Demo',
//         description: 'Hey There! I´m Formy. Your personal form builder demo',
//         startPageId: firstPageId,
//         pages: getDemoPages(),
//         style: {
//             showNameAndDescription: true,
//             showNameAndDescriptionOnEveryPage: true,
//             nextButtonLabel: 'Go on',
//             previousButtonLabel: 'Go back',
//             submitButtonLabel: 'Submit all',
//         },
//         target: {
//             url: 'http://localhost:5173/demp/endpoint',
//         },
//     }
// }

// const getDemoPages = (): { [pageId: string]: FormPageObject } => {
//     const pages: FormPageObject[] = [
//         {
//             id: firstPageId,
//             title: 'Welcome to the form',
//             name: 'welcome',
//             description: 'This is a form',
//             defaultNextPageId: secondPageId,
//             form: [],
//         },
//         {
//             id: secondPageId,
//             title: 'My Form',
//             name: 'my-form',
//             description: 'This is a form',
//             navigationRules: [
//                 {
//                     toPageId: lastPageId,
//                     condition: {
//                         objectId: demoNameObjectId,
//                         operator: '==',
//                         value: 'Bjoern',
//                     }
//                 }
//             ],
//             form: [
//                 {
//                     id: demoNameObjectId,
//                     order: 1,
//                     type: 'text',
//                     label: 'First Name',
//                     required: true,
//                     name: 'firstname',
//                     resultType: 'string',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 3,
//                     type: 'number',
//                     label: 'Age',
//                     name: 'age',
//                     resultType: 'number',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 4,
//                     type: 'checkbox',
//                     label: 'Are you a student?',
//                     name: 'student',
//                     resultType: 'boolean',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 5,
//                     type: 'toggle',
//                     label: 'Do you like Vue?',
//                     name: 'vue',
//                     resultType: 'boolean',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 6,
//                     type: 'switch',
//                     label: 'Do you like PrimeVue?',
//                     name: 'primevue',
//                     resultType: 'boolean',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 7,
//                     type: 'rating',
//                     label: 'Rate this form',
//                     name: 'rating',
//                     resultType: 'number',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 8,
//                     type: 'slider',
//                     label: 'How much do you like this form?',
//                     name: 'slider',
//                     resultType: 'number',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 2,
//                     type: 'textarea',
//                     label: 'Tell me about yourself',
//                     name: 'about',
//                     resultType: 'string',
//                 },
//                 {
//                     id: getGuid(),
//                     order: 5,
//                     type: 'dropdown',
//                     label: 'Select your country',
//                     name: 'country',
//                     resultType: 'string',
//                     options: [
//                         { label: 'Germany', value: 'DE' },
//                         { label: 'United States', value: 'US' },
//                         { label: 'Canada', value: 'CA' },
//                         { label: 'Netherlands', value: 'NL' },
//                     ],
//                 },
//                 {
//                     id: getGuid(),
//                     order: 6,
//                     type: 'list',
//                     label: 'Select your favorite colors',
//                     name: 'colors',
//                     resultType: 'array',
//                     options: [
//                         { label: 'Red', value: 'red' },
//                         { label: 'Green', value: 'green' },
//                         { label: 'Blue', value: 'blue' },
//                         { label: 'Yellow', value: 'yellow' },
//                     ],
//                 },
//                 {
//                     id: getGuid(),
//                     order: 7,
//                     type: 'radio',
//                     label: 'Select your favorite fruit',
//                     name: 'fruit',
//                     resultType: 'string',
//                     options: [
//                         { label: 'Apple', value: 'apple' },
//                         { label: 'Banana', value: 'banana' },
//                         { label: 'Orange', value: 'orange' },
//                         { label: 'Strawberry', value: 'strawberry' },
//                     ],
//                 },
//             ],
//         },
//         {
//             id: lastPageId,
//             title: 'Thank you for filling out the form',
//             name: 'thank-you',
//             description: 'This is the last page',
//             form: [],
//         },
//     ]

//     // map to dict by id
//     const res: { [pageId: string]: FormPageObject } = {};
//     pages.forEach(p => res[p.id] = p);
//     return res;
// }