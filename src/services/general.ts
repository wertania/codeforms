import { FormConfig, FormObject, FormPageObject, FormType, SimpleTemplate } from "@/types";
import { getGuid } from "./guid";

const VERSION = 1;

/**
 * get a new empty instance of a Form Config
 */
export const getEmptyFormConfig = (data: {
    name: string;
    description: string;
    template: null | SimpleTemplate;
}): FormConfig => {
    const firstPageId = getGuid();
    const formObjects: FormObject[] = [];

    if (data.template != null) {
        const templateData = data.template;
        formObjects.push(...templateData.items.map((item, index) => {
            return {
                ...getEmptyFormObject(item.type),
                label: item.label,
                required: item.required,
            }
        }));
    }

    return {
        id: getGuid(),
        version: VERSION,
        name: data.name,
        description: data.description,
        startPageId: '',
        pages: {
            [firstPageId]: {
                id: firstPageId,
                name: 'The first page',
                description: '',
                form: formObjects,
            },
        },
        style: {
            showNameAndDescription: true,
            showNameAndDescriptionOnEveryPage: true,
            nextButtonLabel: 'Next',
            previousButtonLabel: 'Previous',
            submitButtonLabel: 'Submit',
        },
        target: {
            url: '',
        },
    }
}

/**
 * get a new empty instance of a Form Page Object
 */
export function getEmptyPageObject(): FormPageObject {
    const id = getGuid();
    return {
        id,
        name: '',
        description: '',
        form: [],
    }
}


/**
 * get an empty instance of a Form Page Object
 */
export function getEmptyFormObject(formType: FormType): FormObject {
    // Direct mapping is not feasible in a straightforward manner due to TypeScript's static typing,
    // so we use a switch case or if-else logic to manually assign the correct resultType
    let resultType: 'string' | 'number' | 'boolean' | 'array' = 'string';
    switch (formType) {
        // all type string
        case 'dropdown':
        case 'text':
        case 'textarea':
        case 'radio':
        case 'radioimage':
        case 'number':
        case 'rating':
        case 'slider':
            resultType = 'number';
            break;
        case 'checkbox':
            resultType = 'boolean';
            break;
        case 'switch':
            resultType = 'boolean';
            break;
        case 'toggle':
            resultType = 'boolean';
            break;
        case 'list':
            resultType = 'array';
            break;
        case 'multiselect':
            resultType = 'array';
            break;
        default:
            throw new Error('Invalid form type specified');
    }

    const id = getGuid();
    const res: FormObject = {
        id,
        type: formType,
        label: 'Your label',
        name: 'object-' + id,
        required: false,
        resultType: resultType,
    }

    if (formType === 'dropdown' || formType === 'radio' || formType === 'radioimage' || formType === 'multiselect' || formType === 'list') {
        res.options = [
            { label: 'Option 1', value: 'option1' },
        ];
    }

    return res;
}
