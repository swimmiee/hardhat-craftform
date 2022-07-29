import { SetProjectFileProps } from "./setProject.interface";

export const setCraftDefinitions = async ({
    project,
    artifacts,
    craftsRootDir,
}:SetProjectFileProps, typechainOutDir: string) => {
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
        // craft type import
        {
            namedImports: ["CraftType"],
            moduleSpecifier: 'hardhat-craftform/dist/core',
        },
        // typechain import
        {
            namespaceImport: "Typechain",
            moduleSpecifier: `../${typechainOutDir}`
        },
        // configs import
        {
            namespaceImport: "Configs",
            moduleSpecifier: './configs'
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