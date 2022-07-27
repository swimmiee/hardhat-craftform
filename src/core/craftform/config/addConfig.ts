import fs from "fs-extra";
import { getConfigList } from "./getConfigList";
import { getConfigFilename } from "./getPath";
import { ConfigTarget, SavedConfig } from "../../types";
import { BaseConfig } from "../BaseConfig";

interface AddConfigProps<Config extends BaseConfig> extends ConfigTarget {
  newConfig: SavedConfig<Config>;
}

export function _addConfig<Config extends BaseConfig>({
  chain,
  contract,
  newConfig,
}: AddConfigProps<Config>) {
  const filename = getConfigFilename({ chain, contract });
  const configs = getConfigList<Config>({ chain, contract });

  if (configs.findIndex(
    (c) => c.alias === newConfig.alias && c.version === newConfig.version
  ) === -1) {
    configs.push(newConfig);
  }
  else {
    throw Error(`Duplicated config (alias: ${newConfig.alias}, version: ${newConfig.version}) already exists.`)
  }

  fs.writeFileSync(filename, JSON.stringify(configs, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
}
