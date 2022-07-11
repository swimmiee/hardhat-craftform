import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import "./type-extensions";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./craftform";
import { normalizePath } from "./utils/normalize-path";
import { CraftformHelper } from '../core';
import craftTypeFactory from './craftTypeFactory';
import { isCraftInitiated } from './craftTypeFactory/isCraftInitiated';

export const TASK_CRAFTFORM = "craftform"


extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    config.paths.crafts = normalizePath(
      config,
      userConfig.paths?.crafts,
      "crafts"
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


task(TASK_CRAFTFORM, "Generate Craftform type definitions")
  .setAction(async (args, hre, runSuper) => {
    const reset = !isCraftInitiated()
    console.log('hmm...', reset)
    await craftTypeFactory(hre, reset)
    return;
  })

task(TASK_CRAFTFORM, "Generate Craftform configs & type definitions")
  .addParam("reset", "resets all config files", false, types.boolean)
  .setAction(async (args, hre, runSuper) => {
    console.log('always true')
    await craftTypeFactory(hre, true)
    return;
  })


// task(TASK_COMPILE, "After compile::")
//   .setAction(async (args, hre, runSuper) => {
//     await runSuper(args)
//     await hre.run(TASK_CRAFTFORM_GENERATE_CONFIGS)
//   })

