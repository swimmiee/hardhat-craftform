import fs from "fs-extra";
import { getConfigFilename } from "./getPath";
import { ConfigTarget } from "../../types";


export function getConfigList<Config>(target: ConfigTarget) {
  const filename = getConfigFilename(target);
  try {
    return JSON.parse(
      fs.readFileSync(filename, { encoding: "utf-8", flag: "r" })
    ) as Config[];
  } catch (error) {
    return [];
  }
}
