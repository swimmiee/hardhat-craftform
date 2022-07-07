import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Craftform } from "./craftform/class";
import { normalizePath } from "./utils/normalize-path";
import "./type-extensions";
// import GenerateCrafts from "./utils/generate-crafts";


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

  // artifacts.getArtifactPaths().then(console.log);
  //
  // => Result: 
  // [
  //   '/Users/swimmie/test/hardhat-test/artifacts/contracts/Test1.sol/Test1.json',
  //   '/Users/swimmie/test/hardhat-test/artifacts/contracts/Test2.sol/Test2.json',
  //   '/Users/swimmie/test/hardhat-test/artifacts/hardhat/console.sol/console.json'
  // ]

  hre.craftform = lazyObject(() => new Craftform(
    network,
    ethers, 
    deployments,
  ));
});

// task("crafts", "Generate craft.ts file", GenerateCrafts)