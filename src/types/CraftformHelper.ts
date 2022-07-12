import { CraftDeployOptions, CraftType, GetContractProps } from "."

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