import { CraftMetadata, RelationMetadata } from "../metadata";
import { getConfig } from "./utils/getConfig";
import { ClassType, CraftDeployOptions, GetContractProps } from "../types/core";
import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { Network } from "hardhat/types";
import { BaseContract } from "ethers"
import { extractContractNameFromConfigClassName } from "../decorators/extractContractNameFromConfigClass";
import { BaseConfig } from "../decorators";

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
    contractName: string,
    { 
      chain, 
      address, 
      alias
    }: GetContractProps
  ){
    // @TODO :: Interchain 구현
    const craftChain = chain || this._network.name

    console.log(this.__relations)
    console.log(this.__configs)


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
    const craft = new (craftMetadata.target as ClassType<T>)();
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

    return craft;
  }

  private async addConfig(){
    
  }

  public async deploy(
    contractName: string,
    options: CraftDeployOptions<Array<any>>
  ){
    // 해당 체인 중에서 alias가 같은 놈들의
    // 최근 버전을 구하고
    // 버전업 + config도 새로 버전업 한다.
    const { deploy } = this._deployments;
    const deployment = await deploy(contractName, options);

    console.log(deployment)
    
    // update version
  }
}
