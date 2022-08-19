import { SavedConfig } from "../../types";
import { BaseConfig } from "../BaseConfig";

interface SearchTarget {
    alias?: string
    address?: string
    version?: number
}

export const searchTargetConfig = (target: SearchTarget) => (c:SavedConfig<BaseConfig>):boolean =>{
    const entries = Object.entries(target)
    if(entries.length === 0)
      return false;
    return entries.every(([key, value]) => {
        if(value === undefined)
          return true;
        return c[key as keyof typeof target] === value
      })
}