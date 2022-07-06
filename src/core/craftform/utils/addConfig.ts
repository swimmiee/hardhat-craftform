import fs from "fs-extra";

import { BaseCraft } from "../class/BaseCraft";

import { getConfigList } from "./getConfigList";
import { getConfigFilename } from "./getPath";
import { ConfigTarget } from "./types";

interface AddConfigProps<Config extends BaseCraft> extends ConfigTarget {
  newConfig: Config;
}

export function addConfig<Config extends BaseCraft>({
  chain,
  contract,
  newConfig,
}: AddConfigProps<Config>) {
  const filename = getConfigFilename({ chain, contract });
  const configs = getConfigList<Config>({ chain, contract });

  if (configs.findIndex((c) => c.address === newConfig.address) === -1) {
    configs.push(newConfig);
  }

  fs.writeFileSync(filename, JSON.stringify(configs, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
}
