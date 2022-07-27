import { CraftMetadata, RelationMetadata } from "../metadata";
import { ClassType, CraftDeployProps, GetContractProps, NewConfigProps, Versioning } from "../types";
import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { Network } from "hardhat/types";
import { BaseContract } from "ethers"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig";
import { _addConfig, _getConfig, _updateConfig } from "./config";
import { confirmPrompt } from "../../utils/confirmPrompt";
import { BaseConfig } from "./BaseConfig";
import { Config } from "../decorators";
import { createNull } from "@ts-morph/common/lib/typescript";

const chalk = require('chalk');

type CraftLike = BaseContract & {
  $config: BaseConfig & any
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
    craft.$config = config;

    // load & inject Contract Factory
    try {
      const fac = await this._ethers.getContractAt(contract, config.address)
      Object.assign(craft, fac);
    } catch (error) {
      console.log(error)
    }


    // load relations
    const relations = this.__relations[contract]
    if(relations && Array.isArray(relations)){
      relations.forEach((metadata) => {
        const {
          relatedConfig,
          propertyKey,
          relationType,
        } = metadata;
        if (relationType === "Contract") {
  
          Object.assign(craft.$config, {
            [propertyKey]: craft.$config[propertyKey] ? new relatedConfig(
                _getConfig({
                  contract: extractContractNameFromConfigName(
                    relatedConfig.name
                  ),
                  // TODO: Interchain 구현
                  chain: craftChain,
                  address: craft.$config[propertyKey],
                })
              ): null,
          });
        }
      });
    }

    return craft;
  }

  public async deploy<Config extends BaseConfig>(
    contract: string,
    {
      alias,
      options,
      config: customConfig
    }:CraftDeployProps<Config, any[]>
  ): Promise<CraftLike>{

    /**
     * check if duplicated alias exists
     */
    const existing = _getConfig({
      contract, 
      chain: this._network.name,
      alias
    })

    if(existing){
      const contractInfo = `Contract ${contract} with alias "${alias}" already exists.\n` 
      + `Version: ${existing.version}\n`
      + `Address: ${existing.address}\n`
      + `Deployed At: ${new Date(existing.deployedAt * 1000)}\n\n`

      if(options.skipIfAlreadyDeployed === false){
        const cont = await confirmPrompt(
          contractInfo
          + 'Continue to deploy new one? (Press Ctrl + C to quit...)'
        , true)

        if(!cont){
          console.log('Use existing contract.')
          return this.get(contract, {chain: this._network.name, alias, version: existing.version});
        }
      }
      else {
        console.log(contractInfo)
        return this.get(contract, {chain: this._network.name, alias, version: existing.version});
      }
    }

    const newVersion = existing ? +existing.version + 1 : 0

    const { deploy } = this._deployments;

    console.log(`Start deploy contract [${contract}]::${alias}`)
    const deployment = await deploy(
      alias, 
      { contract, ...options }
    );

    console.log(
      chalk.green(`** Contract [${contract}]::${alias} deployed! **\naddress: ${deployment.address}\nversion: ${newVersion}`)
    )

    const config = {
      alias,
      address: deployment.address,
      version: newVersion,
      deployedAt: Math.floor(new Date().getTime() / 1000),
      ...customConfig
    } as unknown as Config
    
    _addConfig({
      chain: this._network.name,
      contract,
      newConfig: config
    })

    return this.get(
      contract, 
      {
        chain: this._network.name, 
        alias, 
        version: newVersion
      }
    );
  }

  public async upsertConfig<C extends BaseConfig>(
    contract: string, 
    config: NewConfigProps<C>, 
    versioning: Versioning = "maintain"
  ):Promise<CraftLike> {

    const configTarget = {
      contract, 
      chain: this._network.name,
      alias: config.alias
    }
    const existing = _getConfig(configTarget)
    if(existing){
      _updateConfig({
        ...configTarget,
        version: existing.version
      }, config, versioning)
    }
    else {
      _addConfig({
        chain: this._network.name,
        contract,
        newConfig: {
          ...config,
          version: 0,
          deployedAt: 0
        }
      })
    }
    return this.get(contract, configTarget)
  }
}
