/**
 * @Config() Mock
 */

export const getConfigFiles = (contractName:string) => 
 `import { Contract, BaseConfig, Config } from "hardhat-craftform/dist/core"
 import { ${contractName} } from "../typechain"
 
 
 @Config()
 export class ${contractName}Config implements BaseConfig {
 
     // required field
     address!: string
 
     // write down your extra config...
 }
 
 // @TODO
 type ${contractName}Args = []
 type ${contractName}Craft = ${contractName} & {
     config: ${contractName}Config
 }
 export type { ${contractName}Args, ${contractName}Craft }`