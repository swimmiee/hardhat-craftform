import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import "./type-extensions";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./core/craftform/Craftform";
import craftTypeFactory from './core/craftFactory';
import { isCraftInitiated } from './core/craftFactory/isCraftInitiated';
import { normalizePath } from "./utils/normalizePath";
import { CraftformHelper } from './CraftformHelper';

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
  const { 
    config, hardhatArguments, tasks, run, network, artifacts, 
    ethers, deployments 
  } = hre;

  hre.craftform = lazyObject(() => new Craftform(
    network,
    ethers, 
    deployments,
  )) as CraftformHelper;
});


task(TASK_CRAFTFORM, "Generate Craftform configs & type definitions")
  .addOptionalParam("reset", "resets all config files", false, types.boolean)
  .setAction(async ({reset}, hre, runSuper) => {
    const shouldReset = Boolean(reset) || !isCraftInitiated()
    await craftTypeFactory(hre, shouldReset)
    return;
  })