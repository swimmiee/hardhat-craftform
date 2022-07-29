import { ModuleDeclarationKind } from "ts-morph";
import { SetProjectFileProps } from "./setProject.interface";

export const setCraftformHelperDefinition = async ({
    project,
    artifacts,
    craftsRootDir
}:SetProjectFileProps) => {
    // craftform type definition file (idempotent)
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const dest = `${craftsRootDir}/craftform.helper.ts`;
    const definitionFile = project.createSourceFile(dest, "", {overwrite: true})

    /*******************
     * Default Imports
     ********************/
    definitionFile.addImportDeclarations([
        // craft factories import
        {
            namespaceImport: "CraftFactory",
            moduleSpecifier: './crafts.factory'
        },
    ])


    // redeclare hardhat/types/runtime
    const runtimeModule = definitionFile.addModule({
        declarationKind: ModuleDeclarationKind.Module,
        hasDeclareKeyword: true,
        name: "\"hardhat/types/runtime\""
    })

    const overwrittenCraftformHelper = runtimeModule.addInterface({
        name: "ICraftformHelper"
    })

    overwrittenCraftformHelper.addMethods(
        contractNames.map(name => ({
            name: "contract",
            parameters: [
                {name: "contract", type: `"${name}"`},
            ],
            returnType: `Promise<CraftFactory.${name}CraftFactory>`
        }))
    )
    
    await project.save()
    console.log(`set craftformHelper definition file at ${dest}`)
}