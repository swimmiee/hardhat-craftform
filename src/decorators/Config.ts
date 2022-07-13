import { craftform } from "hardhat";
import { extractContractNameFromConfigClassName } from "./extractContractNameFromConfigClass";


export function Config(): ClassDecorator {
    return function (target) {
        const contractName = extractContractNameFromConfigClassName(target.name)
        // @ts-ignore
        craftform.__configs.push({
            contractName,
            target,
        });
    };
}
