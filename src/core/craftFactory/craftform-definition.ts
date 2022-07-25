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
    const artifactsList =  (await artifacts.getAllFullyQualifiedNames())
        .map(artifactNames => {
            return artifacts.readArtifactSync(artifactNames)
        })
    const contractNames = artifactsList.map(a => a.contractName)


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
            namedImports: contractNames,
            moduleSpecifier: '../typechain'
        },
        // configs import
        ...artifactsList.map(a => {
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
            type: `CraftType<${name}, ${name}Config>`
        }))
    );

    // redeclare hardhat/types/runtime
    const runtimeModule = definitionFile.addModule({
        declarationKind: ModuleDeclarationKind.Module,
        hasDeclareKeyword: true,
        name: "\"hardhat/types/runtime\""
    })

    // add craftform methods
    runtimeModule.addFunctions(
        contractNames.flatMap(name => {
            return [
                {
                    name: "get",
                    parameters: [
                        {name: "contractName", type: name},
                        {name: "props", type: "GetContractProps"}
                    ],
                    returnType: `Promise<CraftType<${name}, ${name}Config>>`
                },
                {
                    name: "deploy",
                    parameters: [
                        {name: "contract", type: name},
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