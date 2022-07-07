import { existsSync, mkdirSync } from "fs-extra";
import { ConfigTarget } from "./types";

export const getConfigDir = (chain: string) => `configs/${chain}`;

export const getConfigFilename = (target: ConfigTarget) => {
  const dir = getConfigDir(target.chain);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return `${getConfigDir(target.chain)}/${target.contract}.json`;
};
