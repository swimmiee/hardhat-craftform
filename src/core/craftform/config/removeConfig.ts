import fs from "fs-extra";
import { getConfigList } from "./getConfigList";
import { getConfigFilename } from "./getPath";
import { SavedConfig, UpdateConfigTarget } from "../../types";
import { BaseConfig } from "../BaseConfig";
import { searchTargetConfig } from "./searchTargetConfig";


export function _removeConfig<Config extends BaseConfig>(
  { chain, contract, ...target }: UpdateConfigTarget
) {
    const filename = getConfigFilename({ chain, contract });
    
    const configs = getConfigList<SavedConfig<Config>>({ chain, contract });
    const searchFunc = searchTargetConfig(target);
    const targets = configs.filter(searchFunc);

    if(targets.length > 1){
        throw Error("_removeConfig:: More than one remove target.");
    }
    else if(targets.length === 0){
        throw Error("_removeConfig::Config not found.");
    }

    const targetIndex = configs.findIndex(searchFunc);
    // assert targetIndex > -1
    const removedConfig = configs.slice(0, targetIndex).concat(configs.slice(targetIndex+1));

    fs.writeFileSync(
        filename, 
        JSON.stringify(removedConfig, null, 2), 
        {
            encoding: "utf-8",
            flag: "w",
        }
    );

    return;
}
