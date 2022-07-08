import { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";
import { DeployOptions } from "hardhat-deploy/dist/types";

export type ClassType<T = any> = new () => T
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