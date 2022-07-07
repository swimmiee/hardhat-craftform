import { craftform } from "hardhat";
import { RelationMetadata } from "../metadata";

export function Contract<T>(
  craft: (craft?: any) => new () => T
): PropertyDecorator {
  return function (target, propertyKey: string | symbol) {
    const { __relations } = craftform;
    // const { relations } = getGlobalCraftform()
    const contractName = target.constructor.name;
    const newRelation: RelationMetadata = {
      craft,
      target: target.constructor,
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
