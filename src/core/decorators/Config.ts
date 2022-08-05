import { extractContractNameFromConfigName } from "./extractContractFromConfig";
import { craftform } from "hardhat";
import { ClassType } from "../types";

export function Config(): ClassDecorator {
    return function (target) {
        const contract = extractContractNameFromConfigName(target.name)
        // type A
        if(!craftform._global){
            throw Error("@Config Decorator::Hardhat env not configured.")
        }
        craftform._global.configs.push({
            contract,
            target: target as unknown as ClassType<any>
        })
        // type B
        // const imported = () => import("hardhat")
        // imported().then(({craftform}) => {
        //     craftform._global?.configs.push({
        //         contractName,
        //         target,
        //     });
        // })
    };
}
