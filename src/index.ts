import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy'
import "./type-extensions";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import craftCodeGen from './core/craftCodeGen';
import { isCraftInitiated } from './core/craftCodeGen/isCraftInitiated';
import { normalizePath } from "./utils/normalizePath";
import { CraftHelper } from "./core/craftform/CraftfromHelper";

export const TASK_CRAFTFORM = "craftform"

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // add path "/crafts"
    config.paths.crafts = normalizePath(
      config,
      userConfig.paths?.crafts,
      "crafts"
    );

    // add path "/logs"
    config.paths.logs = normalizePath(
      config,
      userConfig.paths?.logs,
      "logs"
    );
  }
);

extendEnvironment((hre) => {
  const { ethers, deployments, network } = hre;

  hre.craftform = lazyObject(() => {
    return new CraftHelper(
      ethers,
      deployments,
      network
    )
  }) 
});


task(TASK_CRAFTFORM, "Generate Craftform configs & type definitions")
  .addOptionalParam("reset", "resets all config files", false, types.boolean)
  .setAction(async ({reset}, hre, runSuper) => {
    const shouldReset = Boolean(reset) || !isCraftInitiated()
    await craftCodeGen(hre, shouldReset)
    return;
  })