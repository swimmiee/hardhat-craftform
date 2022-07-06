import { extendConfig, extendEnvironment, task } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./craftform/class";
// import GenerateCrafts from "./utils/generate-crafts";
import { normalizePath } from "./utils/normalize-path";
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

  // artifacts.getArtifactPaths().then(console.log);
  //
  // => Result: 
  // [
  //   '/Users/swimmie/test/hardhat-test/artifacts/contracts/Test1.sol/Test1.json',
  //   '/Users/swimmie/test/hardhat-test/artifacts/contracts/Test2.sol/Test2.json',
  //   '/Users/swimmie/test/hardhat-test/artifacts/hardhat/console.sol/console.json'
  // ]

  hre.craftform = lazyObject(() => new Craftform());
});

// task("crafts", "Generate craft.ts file", GenerateCrafts)