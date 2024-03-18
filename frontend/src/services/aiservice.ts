import { FormConfig } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

export const aiIsAvailable = async (): Promise<boolean> => {
    const res = await fetch(`${BACKEND_URL}/ai`);
    const json = await res.json();
    return json.aiService;
}

export const getAiDrivenFormConfig = async (usersPrompt: string): Promise<FormConfig> => {
    const res = await fetch(`${BACKEND_URL}/ai`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usersPrompt })
    });
    const json = await res.json();
    return json.formConfig;
}
