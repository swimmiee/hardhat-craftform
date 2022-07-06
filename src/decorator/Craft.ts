import { craftform } from "hardhat";

export function Craft(): ClassDecorator {
  return function (target) {
    craftform.crafts.push({
      // getGlobalCraftform().crafts.push({
      contractName: target.name,
      target,
    });
  };
}
