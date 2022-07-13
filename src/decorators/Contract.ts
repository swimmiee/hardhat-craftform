import { craftform } from "hardhat";
import { ClassType } from "../types";
import { RelationMetadata } from "../metadata";
import { extractContractNameFromConfigName } from "./extractContractFromConfig";

export function Contract(
  relatedConfig: ClassType
): PropertyDecorator {
  return function (target, propertyKey: string | symbol) {
    // @ts-ignore
    const { __relations } = craftform;

    const contractName = extractContractNameFromConfigName(target.constructor.name)
    const newRelation: RelationMetadata = {
      target: target.constructor,
      relatedConfig,
      propertyKey: propertyKey.toString(),
      relationType: "Contract",
    };

    if (__relations[contractName]) {
      __relations[contractName].push(newRelation);
    } else {
      __relations[contractName] = [newRelation];
    }
  };
}
