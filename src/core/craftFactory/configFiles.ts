import path from "path";
import { existsSync } from "fs-extra";
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./setProject.interface"

// @TODO Contract 명 중복 문제
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

    let fileCreateCount = 0;
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
            fileCreateCount++;
        }


        // for clear import config file
        indexFile.addExportDeclaration({
            moduleSpecifier: "./" + path.join(dirName, contractName+".config")
        })
    })
    
    if(fileCreateCount)
        console.log(`${fileCreateCount} Config files created at: ${craftsRootDir}`)

    await project.save()
}