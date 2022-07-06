import { craftform } from "hardhat";
import { RelationMetadata } from "../metadata";

export function Contract<T>(
  craft: (type?: any) => new () => T
): PropertyDecorator {
  return function (target, propertyKey: string | symbol) {
    const { __relations: relations } = craftform;
    // const { relations } = getGlobalCraftform()
    const contractName = target.constructor.name;
    const newRelation: RelationMetadata = {
      craft,
      target: target.constructor,
      propertyKey: propertyKey.toString(),
      relationType: "Contract",
    };

    if (relations[contractName]) {
      relations[contractName].push(newRelation);
    } else {
      relations[contractName] = [newRelation];
    }
  };
}
