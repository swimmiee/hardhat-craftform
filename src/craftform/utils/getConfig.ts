import fs from "fs-extra";
import { getConfigFilename } from "./getPath";
import { ConfigTarget, BaseConfig } from "../../types";

interface GetConfigProps extends ConfigTarget {
  address: string;
}

export function _getConfig<Config extends BaseConfig>(target: GetConfigProps) {
  const filename = getConfigFilename(target);

  // Here:: can throw error when file not exists
  const configs = JSON.parse(
    fs.readFileSync(filename, { encoding: "utf-8", flag: "r" })
  ) as Config[];
  return configs.find((c) => c.address === target.address);
  
}
