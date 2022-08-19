import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy'
import "./type-extensions";
import { extendConfig, extendEnvironment, task } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import craftCodeGen from './core/craftCodeGen';
import { isCraftInitiated } from './core/craftCodeGen/isCraftInitiated';
import { normalizePath } from "./utils/normalizePath";
import { CraftformHelper } from "./core/craftform/CraftfromHelper";
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names'

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
  const { artifacts, ethers, deployments, network } = hre;

  hre.craftform = lazyObject(() => {
    return new CraftformHelper(
      artifacts,
      network,
      ethers,
      deployments,
    )
  }) 
});


task(TASK_CRAFTFORM, "Generate Craftform configs & type definitions")
  .addFlag("reset", "resets all config files")
  .setAction(async ({reset}, hre, runSuper) => {
    const shouldReset = Boolean(reset) || !isCraftInitiated()
    await craftCodeGen(hre, shouldReset)
    return;
  })

task(TASK_COMPILE)
  .addFlag('noCraft', 'Skip Craftform works compilation')
  .addFlag("resetConfig", "resets all craft config files")
  .setAction(async (
    { noCraft, resetConfig }: { noCraft: boolean, resetConfig: boolean }, 
    { userConfig, run },
    runSuper
  ) => {
    await runSuper();
    if(noCraft || userConfig.craftform?.dontOverrideCrafts)
      return;
    await run(TASK_CRAFTFORM, {reset: resetConfig});
  })