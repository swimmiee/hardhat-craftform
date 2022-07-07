import { craftform } from "hardhat";
import { extractContractNameFromConfigClassName } from "./extractContractNameFromConfigClass";

export abstract class BaseConfig {
    address!: string
}

export function Config(): ClassDecorator {
    return function (target) {
        const contractName = extractContractNameFromConfigClassName(target.name)
        console.log(contractName)
        craftform.__configs.push({
            contractName,
            target,
        });
    };
}
