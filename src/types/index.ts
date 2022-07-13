import { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";
import { DeployOptions } from "hardhat-deploy/dist/types";
import { BaseContract } from "ethers"


export type ClassType<T = any> = new (props?:any) => T

export abstract class BaseConfig {
  address: string
  alias: string
  version: number
  deployedAt: number
  print(){
    console.log("A~hahahahahahaha")
  }
}

export type CraftType<Contract extends BaseContract, Config extends BaseConfig> = Contract & {
  config: Config
} 

export type ConfigVersion = number | 'latest'
export type GetContractProps = {
  chain?: string;
  alias: string;
  version?: ConfigVersion
}

export type CraftDeployOptions<T extends Array<any>> = |
  Omit<DeployOptions, 'args' | 'contract'> & {
    args: T
  }

export type ExcludedBaseConfig<Config> = Omit<Config, keyof BaseConfig>
export type CraftDeployConfig<Config> = {
  [key in keyof ExcludedBaseConfig<Config>]: 
    ExcludedBaseConfig<Config>[key] extends BaseConfig ? address 
      : ExcludedBaseConfig<Config>[key]
}
export type CraftDeployProps<C extends BaseConfig, A extends Array<any>> = {
  alias: string
  options: CraftDeployOptions<A>,
  // config: Omit<C, keyof BaseConfig>
  config: CraftDeployConfig<C>
}

export interface ConfigTarget {
  // network name
  chain: string;
  contract: string;
}

export interface GetConfigProps extends ConfigTarget {
  alias?: string;
  address?: string;
  version?: ConfigVersion
}


export type address = string;

export interface CraftformInitializerFormat {
  default: string | "__$_init"
  [contract: string]: string
}