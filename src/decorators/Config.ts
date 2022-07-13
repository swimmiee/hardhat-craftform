import { craftform } from "hardhat";
import { extractContractNameFromConfigName } from "./extractContractFromConfig";


export function Config(): ClassDecorator {
    return function (target) {
        const contractName = extractContractNameFromConfigName(target.name)
        // @ts-ignore
        craftform.__configs.push({
            contractName,
            target,
        });
    };
}
