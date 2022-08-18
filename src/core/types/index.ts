import { Libraries, TxOptions } from "hardhat-deploy/dist/types";
import { BaseContract } from "ethers"
import { BaseConfig } from "../craftform/BaseConfig";

export type ClassType<T = any> = new (props?:any) => T

export type CraftType<Contract extends BaseContract, Config extends BaseConfig> = Contract & {
  $config: Config
} 


export type ConfigVersion = number | 'latest'
export type OptionalArray = Array<any> | undefined

type ProxyOptionBase = {
  owner?: address;
  upgradeIndex?: number;
  proxyContract?: string; // default to EIP173Proxy
  proxyArgs?: any[]; // default to ["{implementation}", "{admin}", "{data}"]
  viaAdminContract?:
    | string
    | {
        name: string;
        artifact?: string;
      };
  implementationName?: string;
};
export type ProxyProps<
  name extends string, 
  ProxyArgs extends OptionalArray = undefined
> = |
  ProxyArgs extends undefined ? undefined : ProxyOptionBase & {
    execute: {
      init: {
        methodName: name | (string & {})
        args: ProxyArgs
      }
    }
  }

export type DeployArgs<
  ArgsType extends OptionalArray, 
  Proxy extends ProxyProps<string, OptionalArray> = undefined
> = Proxy extends undefined ? 
    ( ArgsType extends undefined ? {} : { args: ArgsType } )
  : (
    ArgsType extends undefined ? {
      proxy: Proxy
    } : {
      args: ArgsType,
      proxy: Proxy
    }
  )
  

export type DeployArgsBase = DeployArgs<OptionalArray, ProxyProps<string, OptionalArray>>

export interface CraftDeployOptionsBase extends TxOptions {
  skipIfAlreadyDeployed?: boolean;
  linkedData?: any; // JSONable ?
  libraries?: Libraries;
  // proxy?: boolean | string | ProxyOptions; // TODO support different type of proxies ?
  deterministicDeployment?: boolean | string;
  consoleLog?: boolean
}

export type CraftDeployOptions<
  DeployProps extends DeployArgsBase
> = CraftDeployOptionsBase & DeployProps

const BaseConfigProperties = ["address", "alias", "version", "deployedAt", "update"] as const
type BaseConfigKey = typeof BaseConfigProperties[number]
export type ExcludedBaseConfig<Config extends BaseConfig> = Omit<Config, BaseConfigKey>
export type CraftDeployConfig<Config extends BaseConfig> = {
  [key in keyof ExcludedBaseConfig<Config>]: 
    ExcludedBaseConfig<Config>[key] extends BaseConfig ? address 
      : ExcludedBaseConfig<Config>[key]
}
export type NewConfigProps<Config extends BaseConfig> = CraftDeployConfig<Config> & {alias?: string, address: address}



export interface ConfigTarget {
  // network name
  chain: string;
  contract: string;
}
export type SavedConfig<Config extends BaseConfig> = Omit<Config, "update">
export interface GetConfigProps extends ConfigTarget {
  alias?: string;
  address?: string;
  version?: ConfigVersion
}

export interface UpdateConfigTarget extends ConfigTarget {
  alias?: string
  address?: string
  version?: number
}

export type Versioning = "upgrade" | "maintain"
export type ConfigUpdateable<Config extends BaseConfig> = CraftDeployConfig<Config>
export interface UpdateConfigOption {
  chain?: string
  versioning: Versioning
}

export type address = string;

export interface CraftformInitializerFormat {
  default: string | "__$_init"
  [contract: string]: string
}