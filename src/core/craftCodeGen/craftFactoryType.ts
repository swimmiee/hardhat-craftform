import { SetProjectFileProps } from "./setProject.interface";

export const setCraftFactoryTypeFile = async ({
    project,
    artifacts,
    craftsRootDir,
}:SetProjectFileProps, typechainOutDir: string) => {
    const contractNames = artifacts.map(a => a.contractName)

    // create definition file
    const definitionFile = project.createSourceFile(
        `${craftsRootDir}/crafts.factory.ts`,
        "",
        {overwrite: true}
    )

    /*******************
     * Default Imports
     ********************/
     definitionFile.addImportDeclarations([
        // craft type import
        {
            namedImports: ["CraftFactory"],
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
        // crafts import
        {
            namespaceImport: "Crafts",
            moduleSpecifier: './crafts'
        },
        // deploy args import
        {
            namespaceImport: "Deploy",
            moduleSpecifier: './deploy.args'
        },
    ])

    // export craftTypes
    // export type ${name}Craft = CraftType<${name}, ${name}Config>
    definitionFile.addTypeAliases(
        contractNames.map(name => ({
            name: `${name}CraftFactory`,
            type: `CraftFactory<Typechain.${name}, Configs.${name}Config, Crafts.${name}Craft, Deploy.${name}DeployArgs>`,
            isExported: true
        }))
    );

    await project.save()
}