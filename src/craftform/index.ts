import { CraftMetadata, RelationMetadata } from "../metadata";
import { BaseConfig, ClassType, CraftDeployProps, GetContractProps } from "../types";
import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { Network } from "hardhat/types";
import { BaseContract } from "ethers"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig";
import { _addConfig, _getConfig } from "./utils";


type CraftLike = BaseContract & {
  config: BaseConfig & any
} 
export class Craftform {
  private _network: Network
  // from @nomiclabs/hardhat-ethers
  private _ethers: typeof ethers
  // from hardhat-deploy
  private _deployments: DeploymentsExtension;

  /*********************************************
  *  ( __variables ) :: grabbed by decorators  *
  **********************************************/
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
    contract: string,
    { chain, alias, version }: GetContractProps
  ){
    // @TODO :: Interchain 구현
    const craftChain = chain || this._network.name
    const craftMetadata = this.__configs.find(
      (c) => c.contractName === contract
    );
    if (!craftMetadata)
      throw Error(`Please check crafts' names :: ${contract}`);
    

    const config = _getConfig({
      chain: craftChain,
      contract: contract,
      alias,
      version
    });

    // set Config
    const craft = new (craftMetadata.target as ClassType<T>)();
    craft.config = {};
    Object.assign(craft.config, config);

    // load & inject Contract Factory
    try {
      const fac = await this._ethers.getContractAt("Test1", config.address)
      Object.assign(craft, fac);
    } catch (error) {
      console.log(error)
    }


    // load relations
    this.__relations[contract].forEach((metadata) => {
      const {
        relatedConfig,
        target,
        propertyKey,
        relationType,
      } = metadata;
      if (relationType === "Contract") {

        Object.assign(craft.config, {
          [propertyKey]: _getConfig({
            contract: extractContractNameFromConfigName(
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

  // @TODO
  // config typescript 필요한가?
  private addConfig<C extends BaseConfig>(contract: string, config: C){
    _addConfig({
      chain: this._network.name,
      contract,
      newConfig: config
    })
  }

  public async deploy<Config extends BaseConfig>(
    contract: string,
    {
      alias,
      options,
      config: customConfig
    }:CraftDeployProps<Config, any[]>
  ){

    // @TODO
    // alias 같은 것 있는지 체크.
    // 버전 업할 것인지?
    // 덮어쓰기 할 것인지?
    const { deploy } = this._deployments;
    const deployment = await deploy(
      alias, 
      { contract, ...options }
    );

    // @TODO
    // deployed logger
    console.log(deployment)


    const config = {
      alias,
      address: deployment.address,
      // @TODO
      version: -1,
      deployedAt: Math.floor(new Date().getTime() / 1000),
      ...customConfig
    } as unknown as Config
    

    this.addConfig<Config>(
      contract, 
      config
    )
  }
}
