export const getCraftformDefinitionCode = (contractNames:string[]) => {
    console.log(contractNames)
    const coreImports = `import { CraftType, CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'`
    const typechainImports = `import { ${contractNames.join(', ')} } from '../typechain';`
    const imports = contractNames.map(name => `import { ${name}Args, ${name}Config } from './${name}.craft';`).join('\n')

    const getFunctionDeclares = contractNames.map(name => `
        get(
            contractName: '${name}',
            props: GetContractProps
        ): Promise<CraftType<${name}, ${name}Config>>
    `.trim()).join('\n')

    const deployFunctionDeclares = contractNames.map(name => `
        deploy(
            contractName: '${name}',
            options: CraftDeployOptions<${name}Args>
        ): Promise<void>
    `.trim()).join('\n')

    return(
`${coreImports}
${typechainImports}
${imports}

declare module "hardhat/types/runtime" {
    interface CraftformHelper {
        ${getFunctionDeclares}

        ${deployFunctionDeclares}
    }
}
`)};