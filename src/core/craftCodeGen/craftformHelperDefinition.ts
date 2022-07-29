import { ModuleDeclarationKind } from "ts-morph";
import { SetProjectFileProps } from "./setProject.interface";

export const setCraftformHelperDefinition = async ({
    project,
    artifacts,
    craftsRootDir
}:SetProjectFileProps, typechainOutDir: string) => {
    // craftform type definition file (idempotent)
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const dest = `${craftsRootDir}/craftform.helper.ts`;
    const definitionFile = project.createSourceFile(dest, "", {overwrite: true})

    /*******************
     * Default Imports
     ********************/
    definitionFile.addImportDeclarations([
        // main module import
        {
            namedImports: ['CraftFactory', 'NewConfigProps', 'Versioning'],
            moduleSpecifier: 'hardhat-craftform/dist/core',
        },
        // typechain import
        {
            namespaceImport: "Typechain",
            moduleSpecifier: `../${typechainOutDir}`
        },
        // deploy props import
        {
            namespaceImport: "Deploy",
            moduleSpecifier: './deploy.args'
        },
        // configs import
        {
            namespaceImport: "Configs",
            moduleSpecifier: './configs'
        },
        // crafts import
        {
            namespaceImport: "Crafts",
            moduleSpecifier: './crafts'
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
            returnType: `Promise<CraftFactory<Typechain.${name}, Config.${name}Config, Deploy.${name}DeployArgs>`
        }))
    )
    
    await project.save()
    console.log(`set craftformHelper definition file at ${dest}`)
}