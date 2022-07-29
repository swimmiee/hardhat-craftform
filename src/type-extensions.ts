import "hardhat/types/config";
import "hardhat/types/runtime";
import type { ethers } from "ethers";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { CraftformInitializerFormat } from "./core/types";
import { ICraftformHelper } from "./CraftformHelper";


declare module "hardhat/types/config" {

  export interface HardhatUserConfig {
    craftform?: {
      initializer: string | "__$_init" | CraftformInitializerFormat
    }
  }
  export interface ProjectPathsUserConfig {
    crafts?: string;
    logs?: string
  }

  export interface ProjectPathsConfig {
    crafts: string;
    logs: string
  }

}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    // from @nomiclabs/hardhat-ethers
    ethers: typeof ethers & HardhatEthersHelpers
    // from hardhat-deploy
    deployments: DeploymentsExtension
    // craftform: CraftformHelper
    craftform: ICraftformHelper
  }
}
