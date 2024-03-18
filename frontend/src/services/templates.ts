import { SimpleTemplate } from "@/types";

export const FORM_TEMPLATES: SimpleTemplate[] = [
    {
        templateName: "",
        name: "",
        description: "",
        items: [],
    },
    {
        templateName: "Sign up for an Event",
        name: "Hey. Here you can sign up for my event.",
        description: "Please fill in the details below.",
        items: [
            {
                label: "Name",
                type: "text",
                required: true,
            },
            {
                label: "Email",
                type: "text",
                required: true,
            },
            {
                label: "Phone",
                type: "text",
                required: true,
            },
            {
                label: "Number of tickets",
                type: "number",
                required: true,
            },
            {
                label: "I agree that my data will be stored",
                type: "checkbox",
                required: true,
            },
        ],
    },
    {
        templateName: "Newsletter Subscription",
        name: "Hey. Here you can sign up for my newsletter.",
        description: "Please fill in the details below.",
        items: [
            {
                label: "Name",
                type: "text",
                required: true,
            },
            {
                label: "Email",
                type: "text",
                required: true,
            },
            {
                label: "I agree that my data will be stored. I can unsubscribe at any time.",
                type: "checkbox",
                required: true,
            },
        ],
    }
]