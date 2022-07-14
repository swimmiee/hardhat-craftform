import { DeployOptions } from "hardhat-deploy/dist/types";
import { BaseContract } from "ethers"
import { BaseConfig } from "../craftform/BaseConfig";

export type ClassType<T = any> = new (props?:any) => T


export type CraftType<Contract extends BaseContract, Config extends BaseConfig> = Contract & {
  $: Config
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

export type ExcludedBaseConfig<Config> = Omit<Config, "address" | "alias" | "version" | "deployedAt">
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

export interface UpdateConfigTarget extends ConfigTarget{
  alias?: string
  address?: string
  version?: number
}

export type Versioning = "upgrade" | "maintain"
export type ConfigUpdateable<Config> = CraftDeployConfig<Config>
export interface UpdateConfigOption {
  chain?: string
  versioning: Versioning
}

export type address = string;

export interface CraftformInitializerFormat {
  default: string | "__$_init"
  [contract: string]: string
}