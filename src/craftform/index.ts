import { CraftMetadata, RelationMetadata } from "../metadata";
import { ClassType, CraftDeployProps, GetContractProps } from "../types";
import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { Network } from "hardhat/types";
import { BaseContract } from "ethers"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig";
import { _addConfig, _getConfig } from "./utils";
import { confirmPrompt } from "./utils/confirmPrompt";
import { exit } from "process";
import { BaseConfig } from "./BaseConfig";

const chalk = require('chalk');

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
    
    const config = new (craftMetadata.target as ClassType)(
      _getConfig({
        chain: craftChain,
        contract: contract,
        alias,
        version
      })
    );

    if(!config)
      throw Error(`${alias} (${contract}) Config ${version || 'latest'} Version not found.`)

    // set Config
    const craft = new (craftMetadata.target as ClassType<T>)();
    craft.config = config;

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
        propertyKey,
        relationType,
      } = metadata;
      if (relationType === "Contract") {

        Object.assign(craft.config, {
          [propertyKey]: new relatedConfig(
              _getConfig({
                contract: extractContractNameFromConfigName(
                  relatedConfig.name
                ),
                // TODO: Interchain 구현
                chain: craftChain,
                address: craft.config[propertyKey],
              })
            ),
        });
      }
    });

    return craft;
  }


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

    /**
     * check if duplicated alias exists
     */
    const existing = _getConfig({
      contract, 
      chain: this._network.name,
      alias
    })

    if(existing){
      const cont = await confirmPrompt(
        `Contract ${contract} with alias "${alias}" already exists.\n` 
        + `Version: ${existing.version}\n`
        + `Address: ${existing.address}\n`
        + `Deployed At: ${new Date(existing.deployedAt * 1000)}\n\n`
        + 'Continue to deploy new one? (Press Ctrl + C to quit...)'
      , true)

      if(!cont){
        console.log('User stopped deploy.')
        exit(1)
      }
    }

    const newVersion = existing ? +existing.version + 1 : 0

    const { deploy } = this._deployments;
    const deployment = await deploy(
      alias, 
      { contract, ...options }
    );

    console.log(
      chalk.green(`*** Contract [${contract}]::${alias} deployed! ***\naddress: ${deployment.address}\nversion: ${newVersion}`)
    )

    const config = {
      alias,
      address: deployment.address,
      version: newVersion,
      deployedAt: Math.floor(new Date().getTime() / 1000),
      ...customConfig
    } as unknown as Config
    

    this.addConfig<Config>(
      contract, 
      config
    )
  }
}
