export const getCraftformDefinitionCode = (contractNames:string[]) => {
    const coreImports = `import { CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'`
    const imports = contractNames.map(name => {
        return `import { ${name}Args } from './${name}.craft'`
    }).join('\n')

    const getFunctionDeclares = contractNames.map(name => `
        get(
            contractName: '${name}',
            props: GetContractProps
        ): Promise<void>
    `).join('\n')

    const deployFunctionDeclares = contractNames.map(name => `
        deploy(
            contractName: '${name}',
            options: CraftDeployOptions<${name}Args>
        ): Promise<void>
    `).join('\n')

    return(
`${coreImports}
${imports}

declare module "hardhat/types/runtime" {
    interface CraftformHelper {
        ${getFunctionDeclares}

        ${deployFunctionDeclares}
    }
}
`)};