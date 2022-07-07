import { craftform } from "hardhat";
import { ClassType } from "../craftform/class/interfaces";
import { RelationMetadata } from "../metadata";

export function Contract<T>(
  craft: ClassType<T>
): PropertyDecorator {
  return function (target, propertyKey: string | symbol) {
    const { __relations } = craftform;

    const contractName = target.constructor.name;
    const newRelation: RelationMetadata = {
      relatedConfig: craft,
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
