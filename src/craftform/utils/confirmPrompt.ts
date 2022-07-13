import { prompt } from 'enquirer';
import { exit } from "process";

export const confirmPrompt = async (message: string) => {
    const {cont} = await prompt<{cont: boolean}>({
        type: 'confirm',
        message,
        name: 'cont'
    });
    return cont;
}