import path from "path";
import { CraftformInitializerFormat } from "../types"
import { getContstructorArgsType } from "./get-args-type"
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./set-project.interface"

export const setConfigFiles = async ({
    project,
    artifacts,
    craftsRootDir,
    // contractNames,
    // contractToArtifactMap
}:SetProjectFileProps, initializerFormat?: string | CraftformInitializerFormat) => {
    if(!initializerFormat)
        console.log('\x1b[43m','WARN:: craftform.initializer in hardhat.config.ts is not set. \x1b[0m');

    // for clean import
    const indexFile = project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        "",
        { overwrite: true }
    )

    indexFile.addExportDeclaration({
        moduleSpecifier: './craftform.d'
    })

    await Promise.all(
        artifacts.map(async artifact => {
            const { dirName, contractName } = getArtifactInfo(artifact)

            const argsTypes = await getContstructorArgsType(
                artifact,
                initializerFormat
            )
    
            const configClassFile = project.createSourceFile(
                path.join(
                    craftsRootDir,
                    dirName,
                    contractName+".config.ts"
                ),
                getConfigFileContents(contractName, argsTypes),
                {overwrite: true}
            );
            
            // for clear import config file
            indexFile.addExportDeclaration({
                moduleSpecifier: "./" + path.join(dirName, contractName+".config")
            })
        })
    )
    console.log(`Config files created at: ${craftsRootDir}`)

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