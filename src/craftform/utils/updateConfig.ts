import fs from "fs-extra";
import { getConfigList } from "./getConfigList";
import { getConfigFilename } from "./getPath";
import { ConfigTarget, BaseConfig } from "../../types";

export function updateConfigOne<Config extends BaseConfig>(
  { chain, contract, ...target }: ConfigTarget & Partial<Config>,
  data: Partial<Config>
) {
  const filename = getConfigFilename({ chain, contract });
  const configs = getConfigList<Config>({ chain, contract });

  if (configs.findIndex((c) => c.address === target.address) === -1) {
    throw Error("updateConfig::Config not found.");
  }

  const targetIndex = configs.findIndex((c) => {
    return Object.entries(target).every(([key, value]) => {
      if (key === "__relations") { return true; }
      return c[key as keyof Config] === value;
    });
  });

  if (targetIndex > -1) {
    Object.assign(configs[targetIndex], data);

    fs.writeFileSync(filename, JSON.stringify(configs, null, 2), {
      encoding: "utf-8",
      flag: "w",
    });

    return configs[targetIndex];
  } else {
    throw Error("Update target not exists.");
  }
}
