import { CraftMetadata, RelationMetadata } from "../../metadata";
import { getConfig } from "../utils/getConfig";
import { ClassType, GetContractProps } from "./interfaces";
import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { Network } from "hardhat/types";
import { BaseContract } from "ethers"
import { extractContractNameFromConfigClassName } from "../../decorators/extractContractNameFromConfigClass";
import { BaseConfig } from "../../decorators";

type CraftLike = BaseContract & {
  config: BaseConfig & any
} 
export class Craftform {
  private _network: Network
  // from @nomiclabs/hardhat-ethers
  private _ethers: typeof ethers
  // from hardhat-deploy
  private _deployments: DeploymentsExtension;



  public __configs: CraftMetadata[];
  public __relations: {
    [contractName: string]: RelationMetadata[];
  };

  constructor(
    _network: Network,
    _ethers: typeof ethers,
    _deployments: DeploymentsExtension,
  ) {
    this._network = _network  
    this._ethers = _ethers;
    this._deployments = _deployments;

    this.__configs = [];
    this.__relations = {};
  }


  public async get<T extends CraftLike>(
    _config: ClassType<BaseConfig & any>,
    { 
      chain, 
      address, 
      alias
    }: GetContractProps
  ){
    // @TODO :: Interchain 구현
    const craftChain = chain || this._network.name

    // ts complie error: static property
    const contractName = extractContractNameFromConfigClassName(_config.name);

    const craftMetadata = this.__configs.find(
      (c) => c.contractName === contractName
    );
    if (!craftMetadata)
      throw Error(`Please check crafts' names :: ${contractName}`);
    

    // TODO::: address or alias!!!!!!
    const configs = getConfig({
      chain: craftChain,
      contract: contractName,
      address: address!,
    });

    // set Config
    const craft = new (craftMetadata.target as ClassType<any>)();
    craft.config = {};
    Object.assign(craft.config, configs);

    // load Contract Factory
    try {
      const fac = await this._ethers.getContractAt("Test1", address!)
      Object.assign(craft, fac);
    } catch (error) {
      console.log(error)
    }


    // load relations
    this.__relations[contractName].forEach((metadata) => {
      const {
        relatedConfig,
        target,
        propertyKey,
        relationType,
      } = metadata;
      if (relationType === "Contract") {

        Object.assign(craft.config, {
          [propertyKey]: getConfig({
            contract: extractContractNameFromConfigClassName(
              relatedConfig.name
            ),
            // TODO: Interchain 구현
            chain: craftChain,
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
