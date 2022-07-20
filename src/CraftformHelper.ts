import { CraftDeployProps, CraftType, GetContractProps } from "./core/types/index"

// temp interface.
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