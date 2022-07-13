import { prompt } from 'enquirer';
import { exit } from "process";

export const confirmPrompt = async (message: string, initial: boolean) => {
    const {cont} = await prompt<{cont: boolean}>({
        type: 'confirm',
        message,
        name: 'cont',
        initial
    });
    return cont;
}