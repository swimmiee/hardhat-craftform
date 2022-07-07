import { CraftMetadata, RelationMetadata } from "../../metadata";
import { getConfig } from "../utils/getConfig";
import { GetContractProps } from "./interfaces";
import { deployments, ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";


export class Craftform {
  // from @nomiclabs/hardhat-ethers
  private _ethers: typeof ethers
  // from hardhat-deploy
  private _deployments: DeploymentsExtension;


  public __crafts: CraftMetadata[];
  public __relations: {
    [contractName: string]: RelationMetadata[];
  };

  constructor(
    _ethers: typeof ethers,
    _deployments: DeploymentsExtension
    ) {
    this._ethers = _ethers;
    this._deployments = _deployments;

    this.__crafts = [];
    this.__relations = {};
  }

  public async get<T>(
    _craft: (craft?: any) => (new () => T),
    { chain, address, alias }: GetContractProps
  ){
    const contractName = _craft().name;
    console.log(contractName)

    const craftMetadata = this.__crafts.find(
      (c) => c.contractName === contractName
    );
    if (!craftMetadata)
      throw Error(`Please check crafts' names :: ${contractName}`);
    
  
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

    // load Contract Factory
    const fac = await this._ethers.getContractFactory("Test1")

    // load relations
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
            address: craft.config[propertyKey],
          }),
        });
      }
    });

    return craft as T;
  }

  public async deploy<ArgsType extends Array<any>>(

  ){
    // const { deploy } = deployments;
    // deploy()
  }
}
