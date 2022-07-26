import path from "path";
import { CraftformInitializerFormat } from "../types"
import { getDeployArgsType } from "./getDeployArgsType"
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./setProject.interface"

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

            const deployArgsTypes = await getDeployArgsType(
                artifact,
                initializerFormat
            )
    
            const configClassFile = project.createSourceFile(
                path.join(
                    craftsRootDir,
                    dirName,
                    contractName+".config.ts"
                ),
                "",
                {overwrite: true}
            );
            configClassFile.addImportDeclarations([
                {
                    namedImports: ["Contract", "Config", "address", "BaseConfig"],
                    moduleSpecifier: "hardhat-craftform/dist/core"
                },
                {
                    namedImports: ["BigNumberish"],
                    moduleSpecifier: "ethers"
                }
            ])

            // deploy args type
            configClassFile.addStatements("// argsType for constructor or initializer")
            configClassFile.addTypeAlias({
                name: `${contractName}Args`,
                type: `[${deployArgsTypes.args.join(', ')}]`,
                isExported: true
            })
            if(deployArgsTypes.proxy){
                configClassFile.addTypeAlias({
                    name: `${contractName}ProxyProps`,
                    type: `{
                        execute: ${deployArgsTypes.proxy.execute};
                        proxyArgs: [${deployArgsTypes.proxy.proxyArgs.join(', ')}];
                    }`
                })
            }

            // config class
            configClassFile.addStatements("// Contract Config class")
            const configClass = configClassFile.addClass({
                name: `${contractName}Config`,
                extends: 'BaseConfig',
                decorators: [{
                    name: "Config",
                    arguments: []
                }]
            })

            // for clear import config file
            indexFile.addExportDeclaration({
                moduleSpecifier: "./" + path.join(dirName, contractName+".config")
            })
        })
    )
    console.log(`Config files created at: ${craftsRootDir}`)

    await project.save()
}
// write down your custom configs...