import { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";
import { DeployOptions } from "hardhat-deploy/dist/types";
import { BaseContract } from "ethers"


export type ClassType<T = any> = new () => T

export abstract class BaseConfig {
  address: string
  alias: string
  version: number
  deployedAt: number
}

export type CraftType<Contract extends BaseContract, Config extends BaseConfig> = Contract & {
  config: Config
} 
export interface GetContractPropsBase {
  chain?: string;
  signerOrOptions?: ethers.Signer | FactoryOptions
}
export interface GetContractPropsWithAddress extends GetContractPropsBase {
  address: string;
  alias?: undefined;
}
export interface GetContractPropsWithAlias extends GetContractPropsBase {
  alias: string;
  address?: undefined;
}

export type GetContractProps =
  | GetContractPropsWithAddress
  | GetContractPropsWithAlias;

export type CraftDeployOptions<T extends Array<any>> = |
  Omit<DeployOptions, 'args' | 'contract'> & {
    args: T
  }

export type CraftDeployProps<C extends BaseConfig, A extends Array<any>> = {
  contract: string
  alias: string
  options: CraftDeployOptions<A>,
  config: Omit<C, keyof BaseConfig>
}

export interface ConfigTarget {
  // network name
  chain: string;
  contract: string;
}

export type address = string;

export interface CraftformInitializerFormat {
  default: string | "__$_init"
  [contract: string]: string
}