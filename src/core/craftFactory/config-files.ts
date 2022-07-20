import { CraftformInitializerFormat } from "../types"
import { getContstructorArgsType } from "./get-args-type"
import { SetProjectFileProps } from "./set-project.interface"

export const setConfigFiles = async ({
    project,
    artifacts,
    craftsRootDir,
    contractNames,
    contractToArtifactMap
}:SetProjectFileProps, initializerFormat?: string | CraftformInitializerFormat) => {
    if(!initializerFormat)
        console.log('\x1b[43m','WARN:: craftform.initializer in hardhat.config.ts is not set. \x1b[0m');

    await Promise.all(
        contractNames.map(async contract => {
            const artifact = await artifacts.readArtifact(contractToArtifactMap[contract])
            const argsTypes = await getContstructorArgsType(
                contract,
                artifact,
                initializerFormat
            )
    
            const configClassFile = project.createSourceFile(
                `${craftsRootDir}/${contract}.config.ts`,
                getConfigFileContents(contract, argsTypes),
                {overwrite: true}
            );
        })
    )
    console.log(`Config files created at: ${craftsRootDir}`)


    // for clean import
    project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        `export * from './craftform.d'\n` +
        contractNames.map(name => {
            return `export * from './${name}.config'`
        }).join('\n'),
        {overwrite: true}
    );

    await project.save()
}

/**
 * @Config() Mock
 */

const getConfigFileContents = (contractName:string, argsTypes: string[]) => 
 `import { Contract, Config, address, BaseConfig } from "hardhat-craftform/dist/core"
import { BigNumberish } from "ethers";

 
// args type for constructor or initializer
export type ${contractName}Args = [${argsTypes.join(', ')}]

// Contract Config class
@Config()
export class ${contractName}Config extends BaseConfig {

    // write down your custom configs...
}
`