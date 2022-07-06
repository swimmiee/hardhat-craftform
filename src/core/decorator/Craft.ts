import { craftform } from "hardhat";

export function Craft(): ClassDecorator {
  return function (target) {
    craftform.__crafts.push({
      // getGlobalCraftform().crafts.push({
      contractName: target.name,
      target,
    });
  };
}
