import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import "./type-extensions";
import { extendConfig, extendEnvironment, task } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./craftform";
import { normalizePath } from "./utils/normalize-path";
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import GenerateCrafts from './utils/generate-crafts';

export const TASK_CRAFTFORM_GENERATE_CONFIGS = "craftform:generate"


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
  ));
});


task(TASK_CRAFTFORM_GENERATE_CONFIGS, "Generate Craftform configs")
  .setAction(async (args, hre, runSuper) => {
    return GenerateCrafts(hre)
  })


task(TASK_COMPILE, "After compile::")
  .setAction(async (args, hre, runSuper) => {
    await runSuper(args)
    await hre.run(TASK_CRAFTFORM_GENERATE_CONFIGS)
  })

