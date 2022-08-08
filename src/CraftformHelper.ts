import { CraftFactory } from "./core/craftform/CraftFactory";
import { ConfigMetadata, RelationMetadata } from "./core/metadata"

// ICraftformHelper will be replaced with new CraftformHelper 
// at {projectroot}/crafts/craftform.helper.ts
export interface ICraftformHelper {
    contract(contract: string): CraftFactory<any, any, any>;
    /**
     * @deprecated
     */
    _global?: CraftformGlobal;
}

/**
 * @deprecated
 */
export interface CraftformGlobal {
    configs: ConfigMetadata[];
    relations: {
      [contractName: string]: RelationMetadata[];
    };
}