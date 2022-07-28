import { BaseConfig } from "../core"
import { CraftDeployProps, CraftType, GetContractProps, Versioning } from "./core/types/index"

// temporary interface.
// It will be overwritten by craftform.helper.ts
export interface CraftformHelper {
    get(
        contractName: string,
        props: GetContractProps
    ):Promise<CraftType<any, any>>
    
    deploy(
        contract: string,
        props:CraftDeployProps<any, any[], any>
    ):Promise<CraftType<any, any>>

    upsertConfig<C extends BaseConfig>(
        contract: string, 
        config: C, 
        versioning?: Versioning
    ):Promise<CraftType<any, C>>
}