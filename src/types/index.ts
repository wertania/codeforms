import { Nullable } from "primevue/ts-helpers";

export interface FormPageObject {
    id: string;
    title: string;
    description: string;
    name: string;
    form: FormObject[];
}

type FormType =
    | 'dropdown'
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'switch'
    | 'toggle'
    | 'list'
    | 'multiselect'
    | 'radio'
    | 'radioimage'
    | 'rating'
    | 'slider';

interface FormResultTypeMap {
    dropdown: 'string';
    text: 'string';
    textarea: 'string';
    number: 'number';
    checkbox: 'boolean';
    switch: 'boolean';
    toggle: 'boolean';
    list: 'array';
    multiselect: 'array';
    radio: 'string';
    radioimage: 'string';
    rating: 'number';
    slider: 'number';
}

export interface FormObject {
    id: string;
    order: number;
    type: FormType;
    label: string;
    name: string;
    resultType: FormResultTypeMap[FormType];
    options?: { label: string; value: string; icon?: string }[];
}

export interface FullResult {
    [pageId: string]: PageResult;
}

export interface PageResult {
    id: string;
    name: string;
    inputs: {
        [objectId: string]: FormResult;
    };
}

export type FormResult = {
    id: string;
    name: string;
} & ({
    type: 'string';
    value: Nullable<string>;
} | {
    type: 'number';
    value: number;
} | {
    type: 'boolean';
    value: boolean;
} | {
    type: 'array';
    value: string[];
});
