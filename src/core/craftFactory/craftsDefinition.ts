import { SetProjectFileProps } from "./setProject.interface";

export const setCraftsDefinition = async ({
    project,
    artifacts,
    craftsRootDir,
}:SetProjectFileProps) => {
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const definitionFile = project.createSourceFile(
        `${craftsRootDir}/crafts.ts`,
        "",
        {overwrite: true}
    )

    /*******************
     * Default Imports
     ********************/
     definitionFile.addImportDeclarations([
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
        // craft type import
        {
            namedImports: ["CraftType"],
            moduleSpecifier: 'hardhat-craftform/dist/core',
        },
    ])

    // export craftTypes
    // export type ${name}Craft = CraftType<${name}, ${name}Config>
    definitionFile.addTypeAliases(
        contractNames.map(name => ({
            name: `${name}Craft`,
            type: `CraftType<Typechain.${name}, Configs.${name}Config>`,
            isExported: true
        }))
    );

    await project.save()
}