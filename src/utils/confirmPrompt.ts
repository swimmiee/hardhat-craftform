import { prompt } from 'enquirer';

export const confirmPrompt = async (message: string, initial: boolean) => {
    const {cont} = await prompt<{cont: boolean}>({
        type: 'confirm',
        message,
        name: 'cont',
        initial
    });
    return cont;
}