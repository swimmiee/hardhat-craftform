import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./craftform/class";
import { normalizePath } from "./normalize-path";
import "./type-extensions";


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
  const { config, hardhatArguments, tasks, run, network, artifacts } = hre;

  artifacts.getArtifactPaths().then(console.log);

  hre.craftform = lazyObject(() => new Craftform());
});


export * from './craftform/class'
export * from './craftform/utils'
export * from './decorator'
export * from './metadata'