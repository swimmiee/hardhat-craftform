import { SetProjectFileProps } from "./set-project.interface";

export const setCraftformDefinition = async ({
    project,
    craftsRootDir,
    contractNames
}:SetProjectFileProps) => {
       // craftform type definition file (idempotent)
       project.createSourceFile(
        `${craftsRootDir}/craftform.d.ts`,
        getCraftformDefinitionContent(contractNames),
        {overwrite: true}
    )
    await project.save()

    console.log(`set ${craftsRootDir}/craftform.d.ts`)
}


export const getCraftformDefinitionContent = (contractNames:string[]) => {
    const coreImports = `import { CraftType, CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'`
    const typechainImports = `import { ${contractNames.join(', ')} } from '../typechain';`
    const imports = contractNames.map(name => `import { ${name}Args, ${name}Config } from './${name}.config';`).join('\n')

    const getFunctionDeclares = contractNames.map(name => `        get(
            contractName: '${name}',
            props: GetContractProps
        ): Promise<CraftType<${name}, ${name}Config>>
    `.trimEnd()).join('\n')

    const deployFunctionDeclares = contractNames.map(name => `        deploy(
            contractName: '${name}',
            options: CraftDeployOptions<${name}Args>
        ): Promise<void>
    `.trimEnd()).join('\n')

    const craftTypes = contractNames.map(
        name => `export type ${name}Craft = CraftType<${name}, ${name}Config>`
    ).join('\n')

    return(`${coreImports}
${typechainImports}
${imports}

${craftTypes}

declare module "hardhat/types/runtime" {
    interface CraftformHelper {
${getFunctionDeclares}

${deployFunctionDeclares}
    }
}`)};

