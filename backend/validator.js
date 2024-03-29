/**
 * Copied from the frontend /src/services/validator.ts and removed TypeScript
 */

function isTypeOfFormType(type) {
    return [
        'dropdown', 'text', 'textarea', 'number', 'checkbox', 'switch', 'toggle',
        'list', 'multiselect', 'radio', 'radioimage', 'rating', 'slider',
    ].includes(type);
}

function validateBasicStructure(input) {
    // Required top-level fields
    const requiredFields = ['id', 'version', 'name', 'description', 'pages', 'startPageId', 'target'];
    const hasAllRequiredFields = requiredFields.every(field => field in input);
    const hasValidTypes = typeof input.id === 'string' &&
        typeof input.version === 'number' &&
        typeof input.name === 'string' &&
        typeof input.description === 'string' &&
        typeof input.startPageId === 'string' &&
        typeof input.target.url === 'string' &&
        typeof input.pages === 'object';
    return hasAllRequiredFields && hasValidTypes;
}

function validatePageObject(page) {
    if (typeof page.id !== 'string' || typeof page.name !== 'string' || !Array.isArray(page.form)) {
        return false;
    }
    return page.form.every(validateFormObject);
}

function validateFormObject(formObject) {
    if (typeof formObject.id !== 'string' ||
        !isTypeOfFormType(formObject.type) ||
        typeof formObject.label !== 'string' ||
        typeof formObject.name !== 'string' ||
        !validateResultType(formObject.type, formObject.resultType)) {
        console.log('validateFormObject 1', formObject);
        return false;
    }
    if (formObject.options && !formObject.options.every((option) =>
        typeof option.label === 'string' && typeof option.value === 'string' &&
        (option.icon ? typeof option.icon === 'string' : true))) {
        console.log('validateFormObject 2', formObject);
        return false;
    }
    return true;
}

function validateResultType(formType, resultType) {
    const formResultTypeMap = {
        dropdown: 'string',
        text: 'string',
        textarea: 'string',
        number: 'number',
        checkbox: 'boolean',
        switch: 'boolean',
        toggle: 'boolean',
        list: 'array',
        multiselect: 'array',
        radio: 'string',
        radioimage: 'string',
        rating: 'number',
        slider: 'number',
    };
    return formResultTypeMap[formType] === resultType;
}

function validateNavigationRule(rule, pages) {
    if (typeof rule.toPageId !== 'string' || !pages[rule.toPageId] || !validateCondition(rule.condition)) {
        return false;
    }
    return true;
}

function validateCondition(condition) {
    const validOperators = ['==', '!=', '>', '<', '>=', '<=', 'contains'];
    return typeof condition.objectId === 'string' &&
        validOperators.includes(condition.operator) &&
        (typeof condition.value === 'string' || typeof condition.value === 'number' || typeof condition.value === 'boolean' || Array.isArray(condition.value));
}

function validateFormConfig(input) {
    if (!validateBasicStructure(input)) {
        throw new Error('Invalid basic structure');
    }

    Object.values(input.pages).forEach((page) => {
        if (!validatePageObject(page)) {
            throw new Error(`Invalid page structure for page ID ${page.id}`);
        }

        if (page.navigationRules) {
            page.navigationRules.forEach((rule) => {
                if (!validateNavigationRule(rule, input.pages)) {
                    throw new Error(`Invalid navigation rule in page ID ${page.id}`);
                }
            });
        }
    });

    return input;
}

module.exports = {
    validateFormConfig,
};