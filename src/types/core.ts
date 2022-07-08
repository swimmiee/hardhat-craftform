import { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";
import { DeployOptions } from "hardhat-deploy/dist/types";
import { BaseContract } from "ethers"
import { BaseConfig } from "../decorators";

export type ClassType<T = any> = new () => T
export type Craft<Contract extends BaseContract, Config extends BaseConfig> = Contract & {
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

export type CraftDeployOptions<T extends Array<any>> = Omit<DeployOptions, "args"> & {args: T}