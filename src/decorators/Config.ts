import { craftform } from "hardhat";

export interface BaseConfig {
    address: string
}

export function Config(): ClassDecorator {
    return function (target) {
        craftform.__configs.push({
            contractName: target.name,
            target,
        });
    };
}
