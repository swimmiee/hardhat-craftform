import { existsSync } from "fs";
import path from "path";
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./setProject.interface"

export const setConfigFiles = async ({
    project,
    artifacts,
    craftsRootDir,
}:SetProjectFileProps, reset: boolean) => {

    // for clean import
    const indexFile = project.createSourceFile(
        `${craftsRootDir}/configs.ts`,
        "",
        { overwrite: true }
    )

    artifacts.map(async artifact => {
        const { dirName, contractName } = getArtifactInfo(artifact)
        const dest = path.join(
            craftsRootDir,
            dirName,
            contractName+".config.ts"
        );
        const fileExists = existsSync(dest)

        if(!fileExists || reset){
            const configClassFile = project.createSourceFile(dest, "", {overwrite: true});
    
            configClassFile.addImportDeclaration({
                namedImports: ["Contract", "Config", "BaseConfig"],
                moduleSpecifier: "hardhat-craftform/dist/core"
            })
            
            // config class
            configClassFile.addStatements("\n// Contract Config class")
            const configClass = configClassFile.addClass({
                name: `${contractName}Config`,
                extends: 'BaseConfig',
                decorators: [{
                    name: "Config",
                    arguments: []
                }],
                isExported: true
            })
    
            configClass.addJsDoc("Write down your custom configs...\n You can use @Contract property decorator to connect other contract's config.")
        }


        // for clear import config file
        indexFile.addExportDeclaration({
            moduleSpecifier: "./" + path.join(dirName, contractName+".config")
        })
    })
    
    console.log(`Config files created at: ${craftsRootDir}`)

    await project.save()
}