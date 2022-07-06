import path from "path";
import { HardhatConfig } from "hardhat/types";


export function normalizePath(
    config: HardhatConfig,
    userPath: string | undefined,
    defaultPath: string
  ): string {
    if (userPath === undefined) {
      userPath = path.join(config.paths.root, defaultPath);
    } else {
      if (!path.isAbsolute(userPath)) {
        userPath = path.normalize(path.join(config.paths.root, userPath));
      }
    }
    return userPath;
  }