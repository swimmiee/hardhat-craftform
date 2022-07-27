import fs from "fs-extra";
import { getConfigFilename } from "./getPath";
import { ConfigTarget, SavedConfig } from "../../types";
import { BaseConfig } from "../BaseConfig";


export function getConfigList<Config extends BaseConfig>(target: ConfigTarget) {
  const filename = getConfigFilename(target);
  try {
    return JSON.parse(
      fs.readFileSync(filename, { encoding: "utf-8", flag: "r" })
    ) as SavedConfig<Config>[];
  } catch (error) {
    return [];
  }
}
