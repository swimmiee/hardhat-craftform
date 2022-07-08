import { CraftDeployOptions, GetContractProps } from "./core"

export interface CraftformHelper {
    get(
        contractName: string,
        props: GetContractProps
    ):Promise<void>
    
    deploy: (
      contractName: string,
      options: CraftDeployOptions<Array<any>>
    ) => Promise<void>
}