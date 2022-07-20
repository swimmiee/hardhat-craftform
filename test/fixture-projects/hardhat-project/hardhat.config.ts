// We load the plugin here.
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import "../../../src";


dotenv.config({
  path: "../../../.env"
});

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  craftform: {
    initializer: "__$_init"
  },
  namedAccounts:{
    deployer: {
      default: 0
    }
  },
  networks: {
    baobab: {
      chainId: 1001,
      url: "https://public-node-api.klaytnapi.com/v1/baobab",
      accounts: [process.env.PRIVATE_KEY!]
    },
  }
};

export default config;
