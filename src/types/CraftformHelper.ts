import { CraftDeployProps, CraftType, GetContractProps } from "./index"

// temporary interface.
// It will be overwritten by craftform.d.ts
export interface CraftformHelper {
    get(
        contractName: string,
        props: GetContractProps
    ):Promise<CraftType<any, any>>
    
    deploy: (
        contract: string,
        props:CraftDeployProps<any, any[]>
    ) => Promise<void>
}