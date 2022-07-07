import "hardhat/types/config";
import "hardhat/types/runtime";
import type { ethers } from "ethers";
import { Craftform } from "./craftform/class";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";

declare module "hardhat/types/config" {

  export interface ProjectPathsUserConfig {
    crafts?: string;
  }

  export interface ProjectPathsConfig {
    crafts: string;
  }

}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    // from @nomiclabs/hardhat-ethers
    ethers: typeof ethers & HardhatEthersHelpers
    // from hardhat-deploy
    deployments: DeploymentsExtension
    craftform: Craftform;
  }
}
