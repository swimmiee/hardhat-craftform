import "hardhat/types/config";
import "hardhat/types/runtime";
import type { ethers } from "ethers";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { CraftformHelper } from "./types/CraftformHelper";
import { CraftformInitializerFormat } from "./types";


declare module "hardhat/types/config" {

  export interface HardhatUserConfig {
    craftform?: {
      initializer: string | "__$_init" | CraftformInitializerFormat
    }
  }
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
    craftform: CraftformHelper
  }
}
