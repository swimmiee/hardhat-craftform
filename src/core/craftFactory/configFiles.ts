import path from "path";
import { CraftformInitializerFormat } from "../types"
import { getDeployArgsType } from "./getDeployArgsType"
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./setProject.interface"
import { OptionalKind, TypeAliasDeclarationStructure } from "ts-morph";

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
                    namedImports: ["Contract", "Config", "address", "BaseConfig", "DeployArgs", "ProxyProps"],
                    moduleSpecifier: "hardhat-craftform/dist/core"
                },
                {
                    namedImports: ["BigNumberish"],
                    moduleSpecifier: "ethers"
                }
            ])

            // deploy args type
            configClassFile.addStatements("// argsType for constructor or initializer")
            const typeAliases:OptionalKind<TypeAliasDeclarationStructure>[] = []
            typeAliases.push({
                name: `${contractName}Args`,
                type: `[${deployArgsTypes.args.join(', ')}]`
            })
            // proxy 있는 경우
            if(deployArgsTypes.proxy){
                typeAliases.push({
                    name: `${contractName}ProxyProps`,
                    type: `ProxyProps<"${deployArgsTypes.proxy.execute}", [${deployArgsTypes.proxy.proxyArgs.join(', ')}]>`,
                })
                typeAliases.push({
                    name: `${contractName}DeployArgs`,
                    type: `DeployArgs<${contractName}Args, ${contractName}ProxyProps>`,
                    isExported: true
                })
            }
            // proxy 없는 경우
            else {
                typeAliases.push({
                    name: `${contractName}DeployArgs`,
                    type: `DeployArgs<${contractName}Args>`,
                    isExported: true
                })
            }
            configClassFile.addTypeAliases(typeAliases)
            
            // config class
            configClassFile.addStatements("// Contract Config class")
            const configClass = configClassFile.addClass({
                name: `${contractName}Config`,
                extends: 'BaseConfig',
                decorators: [{
                    name: "Config",
                    arguments: []
                }],
                isExported: true
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