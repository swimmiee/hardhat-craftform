import fs from "fs-extra";

import { BaseCraft } from "../class/BaseCraft";

import { getConfigFilename } from "./getPath";
import { ConfigTarget } from "./types";

interface GetConfigProps extends ConfigTarget {
  address: string;
}

export function getConfig<Config extends BaseCraft>(target: GetConfigProps) {
  const filename = getConfigFilename(target);
  try {
    const configs = JSON.parse(
      fs.readFileSync(filename, { encoding: "utf-8", flag: "r" })
    ) as Config[];
    return configs.find((c) => c.address === target.address);
  } catch (error) {
    return [];
  }
}
