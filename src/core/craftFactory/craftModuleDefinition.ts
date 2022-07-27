import { ModuleDeclarationKind } from "ts-morph";
import { SetProjectFileProps } from "./setProject.interface";

export const setCraftModuleDefinition = async ({
    project,
    artifacts,
    craftsRootDir
}:SetProjectFileProps) => {
    // craftform type definition file (idempotent)
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const definitionFile = project.createSourceFile(
        `${craftsRootDir}/craftform.module.ts`,
        "",
        {overwrite: true}
    )

    /*******************
     * Default Imports
     ********************/
    definitionFile.addImportDeclarations([
        // main module import
        {
            namedImports: ['CraftType', 'GetContractProps'],
            moduleSpecifier: 'hardhat-craftform/dist/core',
        },
        // typechain import
        {
            namespaceImport: "Typechain",
            moduleSpecifier: '../typechain'
        },
        // configs import
        {
            namespaceImport: "Configs",
            moduleSpecifier: './configs'
        },
        // deploy props import
        {
            namespaceImport: "Deploy",
            moduleSpecifier: './deploy.args'
        },
        // crafts import
        {
            namespaceImport: "Crafts",
            moduleSpecifier: './crafts.args'
        },
        
    ])


    // redeclare hardhat/types/runtime
    const runtimeModule = definitionFile.addModule({
        declarationKind: ModuleDeclarationKind.Module,
        hasDeclareKeyword: true,
        name: "\"hardhat/types/runtime\""
    })

    const overwrittenCraftformHelper = runtimeModule.addInterface({
        name: "CraftformHelper"
    })

    // add craftform methods
    overwrittenCraftformHelper.addMethods(
        contractNames.flatMap(name => {
            return [
                {
                    name: "get",
                    parameters: [
                        {name: "contract", type: `"${name}"`},
                        {name: "props", type: "GetContractProps"}
                    ],
                    returnType: `Promise<Crafts.${name}Craft>`
                },
                {
                    name: "deploy",
                    parameters: [
                        {name: "contract", type: `"${name}"`},
                        {name: "props", type: `Deploy.${name}DeployProps`}
                    ],
                    returnType: `Promise<Crafts.${name}Craft>`
                },
            ]
        })
    )
    
    await project.save()

    console.log(`set ${craftsRootDir}/craftform.module.ts`)
}