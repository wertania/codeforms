
export type FormType =
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

export interface FormResultTypeMap {
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
    type: FormType;
    label: string;
    name: string;
    required?: boolean;
    resultType: FormResultTypeMap[FormType];
    options?: { label: string; value: string; icon?: string }[];
}

export interface SimpleTemplate {
    templateName: string;
    name: string;
    description: string;
    items: {
        label: string;
        type: FormType;
        required: boolean;
    }[];
}

export interface FormPageObject {
    id: string;
    title?: string;
    description?: string;
    name: string;
    form: FormObject[];
    navigationRules?: NavigationRule[]; // Optional, as the last page may not have any navigation rules
    defaultNextPageId?: string; // Optional, as the last page may not have a default next page
}

export interface FormConfig {
    id: string;
    version: number;
    name: string;
    description: string;
    pages: {
        [pageId: string]: FormPageObject;
    };
    startPageId: string;
    style: {
        showNameAndDescription?: boolean;
        showNameAndDescriptionOnEveryPage?: boolean;
        nextButtonLabel?: string;
        previousButtonLabel?: string;
        submitButtonLabel?: string;
    };
    target: {
        url: string;
    }
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
    value: string;
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

/**
 * Allows for conditional navigation between pages
 * The first matching rule will be used to determine
 * the next page to keep the flow simple here
 */
export type ConditionOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains';

export type PossibleResultType = 'string' | 'number' | 'boolean' | 'array';

export interface NextPageCondition {
    objectId: string; // ID of the form object the condition applies to
    operator: ConditionOperator;
    valueType: PossibleResultType; // Type of the value to compare against
    value: string | number | boolean | string[]; // Value to compare against, based on the form object type
}

export interface NavigationRule {
    toPageId: string;
    condition: NextPageCondition; // NextPageCondition to evaluate to move from `fromPageId` to `toPageId`
}
