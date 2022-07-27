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
        // main module import
        {
            namedImports: ['GetContractProps', 'NewConfigProps', 'Versioning'],
            moduleSpecifier: 'hardhat-craftform/dist/core',
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
        name: "CraftformHelper"
    })

    // add craftform methods
    overwrittenCraftformHelper.addMethods(
        contractNames.flatMap(name => [
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
            {
                name: `upsertConfig`,
                parameters: [
                    {name: "contract", type: `"${name}"`},
                    {name: "config", type: `NewConfigProps<Configs.${name}Config>`},
                    {name: "versioning?", type: "Versioning"}
                ],
                returnType: `Promise<Crafts.${name}Craft>`
            },
        ])
    )
    
    await project.save()
    console.log(`set craftformHelper definition file at ${dest}`)
}