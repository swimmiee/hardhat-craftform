import path from "path";
import { ModuleDeclarationKind } from "ts-morph";
import { getArtifactInfo } from "./getArtifactInfo";
import { SetProjectFileProps } from "./set-project.interface";

export const setCraftformDefinition = async ({
    project,
    artifacts,
    craftsRootDir
}:SetProjectFileProps) => {
    // craftform type definition file (idempotent)
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const definitionFile = project.createSourceFile(
        `${craftsRootDir}/craftform.d.ts`,
        "",
        {overwrite: true}
    )

    /*******************
     * Default Imports
     ********************/
    definitionFile.addImportDeclarations([
        // main module import
        {
            namedImports: ['CraftType', 'CraftDeployProps', 'GetContractProps'],
            moduleSpecifier: 'hardhat-craftform/dist/core',
        },
        // typechain import
        {
            namespaceImport: "Typechain",
            moduleSpecifier: '../typechain'
        },
        // configs import
        ...artifacts.map(a => {
            const {contractName, dirName} = getArtifactInfo(a)
            return {
                namedImports: [`${contractName}Args`, `${contractName}Config`],
                moduleSpecifier: './' + path.join(dirName, contractName+".config")
            }
        })
    ])

    // export craftTypes
    // export type ${name}Craft = CraftType<${name}, ${name}Config>
    definitionFile.addTypeAliases(
        contractNames.map(name => ({
            name: `${name}Craft`,
            type: `CraftType<Typechain.${name}, ${name}Config>`
        }))
    );

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
                    returnType: `Promise<${name}Craft>`
                },
                {
                    name: "deploy",
                    parameters: [
                        {name: "contract", type: `"${name}"`},
                        {name: "props", type: `CraftDeployProps<${name}Config, ${name}Args>`}
                    ],
                    returnType: `Promise<void>`
                },
            ]
        })
    )
    
    await project.save()

    console.log(`set ${craftsRootDir}/craftform.d.ts`)
}