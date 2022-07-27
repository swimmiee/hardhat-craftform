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
        `${craftsRootDir}/configs.ts`,
        "",
        { overwrite: true }
    )

    artifacts.map(async artifact => {
        const { dirName, contractName } = getArtifactInfo(artifact)


        const configClassFile = project.createSourceFile(
            path.join(
                craftsRootDir,
                dirName,
                contractName+".config.ts"
            ),
            "",
            {overwrite: true}
        );
        
        configClassFile.addImportDeclaration({
            namedImports: ["Contract", "Config", "BaseConfig"],
            moduleSpecifier: "hardhat-craftform/dist/core"
        })
        
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

        configClass.addJsDoc("Write down your custom configs...")

        // for clear import config file
        indexFile.addExportDeclaration({
            moduleSpecifier: "./" + path.join(dirName, contractName+".config")
        })
    })
    
    console.log(`Config files created at: ${craftsRootDir}`)

    await project.save()
}