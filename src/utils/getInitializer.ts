import { userConfig } from "hardhat";
import { CraftformInitializerFormat } from "../core/types";

export const getInitializer = (
    contractName: string,
    initializerFormat?: string | CraftformInitializerFormat
) => {
    if(!initializerFormat){
        try {
            initializerFormat = userConfig.craftform?.initializer
            if(!initializerFormat)
                return null
        } catch (error) {
            return null
        }
    }
    const targetFormat = typeof initializerFormat === "string" ? 
        initializerFormat : 
        initializerFormat[contractName] || initializerFormat.default

    return targetFormat.replace("$", contractName)
}