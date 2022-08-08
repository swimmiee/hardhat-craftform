import { craftform } from "hardhat";
import { ClassType } from "../types";
import { RelationMetadata } from "../metadata";
import { extractContractNameFromConfigName } from "./extractContractFromConfig";

export function Contract(
  relatedConfig: ClassType
): PropertyDecorator {
  return function (target, propertyKey: string | symbol) {
    const contractName = extractContractNameFromConfigName(target.constructor.name)
    const newRelation: RelationMetadata = {
      target: target.constructor as unknown as ClassType<any>,
      relatedConfig,
      propertyKey: propertyKey.toString(),
      relationType: "Contract",
    };

    // @TODO type A
    if(!craftform._global){
      throw Error("@Contract Decorator:;Hardhat env not configured.")
    }
    const { relations } = craftform._global;
    if (relations[contractName]) {
      relations[contractName].push(newRelation);
    } else {
      relations[contractName] = [newRelation];
    }
  };
}
