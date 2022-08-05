import { CraftformInitializerFormat } from "../core/types";

export const getInitializer = (
    contractName: string,
    initializerFormat?: string | CraftformInitializerFormat
) => {
    if(!initializerFormat){
        return null
    }
    const targetFormat = typeof initializerFormat === "string" ? 
        initializerFormat : 
        initializerFormat[contractName] || initializerFormat.default

    return targetFormat.replace("$", contractName)
}