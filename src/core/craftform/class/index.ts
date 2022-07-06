import { CraftMetadata, RelationMetadata } from "../../metadata";
import { getConfig } from "../utils/getConfig";

import { GetContractProps } from "./interfaces";

export class Craftform {
  public __crafts: CraftMetadata[];
  public __relations: {
    [contractName: string]: RelationMetadata[];
  };

  constructor() {
    this.__crafts = [];
    this.__relations = {};
  }

  public async get<T>({ contractName, chain, address, alias }: GetContractProps) {
    const craftMetadata = this.__crafts.find(
      (c) => c.contractName === contractName
    );
    if (!craftMetadata) {
      throw Error(`Please check crafts' names :: ${contractName}`);
    }
    // throw Error("Please check crafts if there are duplicated names.")

    // TODO::: address or alias!!!!!!
    const configs = getConfig({
      chain,
      contract: contractName,
      address: address!,
    });

    const craft = new (craftMetadata.target as new () => any)();

    // set Config
    craft.config = {};
    Object.assign(craft.config, configs);

    this.__relations[contractName].forEach((metadata) => {
      const {
        craft: relatedCraft,
        target,
        propertyKey,
        relationType,
      } = metadata;
      if (relationType === "Contract") {
        Object.assign(craft.config, {
          [propertyKey]: getConfig({
            contract: relatedCraft().name,
            // TODO: Interchain 구현
            chain,
            address: craft[propertyKey],
          }),
        });
      }
    });

    return craft as T;
  }
}
