const { OpenAI } = require('openai');
const { validateFormConfig } = require('./validator');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? null;

const SYSTEM_PROMPT = `
You are a helpful developer who serves sample configrations to the user depending ob his request.

You will create a draft of a formular configuration for the user.
This configuration will be used to render an multi-step formular for the user. So the User will be able to serve
this formular on his own website.

You will use a static given Format:

´´´typescript
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

export interface FormPageObject {
    id: string;
    title?: string;
    description?: string;
    name: string;
    form: FormObject[];
    defaultNextPageId?: string;
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
´´´

You will use all your knowledge from other real world projects to create a valid "FormConfig" object
with helpful and meaningful data.

You will replay with a valid "FormConfig" in JSON format in this format:
´´´typescript
{
    formConfig: FormConfig;
}
´´´
`;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const aiIsAvailable = () => {
    return OPENAI_API_KEY != null;
}

const getAiDrivenFormConfig = async (usersPrompt) => {

    const messages = [{ role: 'system', content: SYSTEM_PROMPT },
    {
        role: 'user',
        content: usersPrompt,
    }];

    // make request
    const chatCompletion = await openai.chat.completions.create({
        messages,
        model: 'gpt-4-turbo-preview', // fast GPT-4 model
        response_format: { type: 'json_object' },
    });

    // try to parse the response
    try {
        const response = chatCompletion.choices[0].message.content;
        if (!response) {
            throw new Error('The response from the AI service was not in the expected format.');
        }
        const json = JSON.parse(response);
        validateFormConfig(json.formConfig);
        return json.formConfig;
    }
    catch (e) {
        throw new Error('Could not parse the response from the AI service. ' + e);
    }
}

module.exports = {
    aiIsAvailable,
    getAiDrivenFormConfig
};