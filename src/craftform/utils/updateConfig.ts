import fs from "fs-extra";
import { getConfigList } from "./getConfigList";
import { getConfigFilename } from "./getPath";
import { ConfigUpdateable, UpdateConfigTarget, Versioning } from "../../types";
import { BaseConfig } from "../BaseConfig";



export function _updateConfig<Config extends BaseConfig>(
  { chain, contract, ...target }: UpdateConfigTarget,
  data: Partial<ConfigUpdateable<Config>>,
  versioning: Versioning
) {
  const filename = getConfigFilename({ chain, contract });
  type RawConfig = ConfigUpdateable<Config> & BaseConfig
  
  const configs = getConfigList<RawConfig>({ chain, contract });
  const searchFunc = (c:RawConfig):boolean =>{
    return Object
      .entries(target)
      .every(([key, value]) => {
        if(value === undefined)
          return true;
        return c[key as keyof typeof target] === value
      })
  }

  const targets = configs.filter(searchFunc)

  if(targets.length > 1){
    throw Error("_updateConfig:: More than one update target.");
  }
  else if(targets.length === 0){
    throw Error("_updateConfig::Config not found.");
  }

  const targetIndex = configs.findIndex(searchFunc);
  // assert targetIndex > -1

  // Manange Versioning
  if(versioning === 'maintain'){
    Object.assign(configs[targetIndex], data);
  } else {  // 'upgrade'
    const {version, ...rest} = configs[targetIndex]
    const upgraded = Object.assign(rest, data)
    const clone = {
      ...upgraded,
      version: +version + 1
    }
    configs.push(clone as RawConfig)
  }
  

  fs.writeFileSync(filename, JSON.stringify(configs, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });

  return configs[targetIndex];
}
