import { CraftDeployOptions, CraftType, GetContractProps } from "./core"

export interface CraftformHelper {
    get(
        contractName: string,
        props: GetContractProps
    ):Promise<CraftType<any, any>>
    
    deploy: (
      contractName: string,
      options: CraftDeployOptions<Array<any>>
    ) => Promise<void>
}