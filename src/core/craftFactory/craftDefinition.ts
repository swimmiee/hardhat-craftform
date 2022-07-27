import { SetProjectFileProps } from "./setProject.interface";

export const setCraftDefinition = async ({
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
    // export craftTypes
    // export type ${name}Craft = CraftType<${name}, ${name}Config>
    definitionFile.addTypeAliases(
        contractNames.map(name => ({
            name: `${name}Craft`,
            type: `CraftType<Typechain.${name}, Config.${name}Config>`,
            isExported: true
        }))
    );

    await project.save()
}