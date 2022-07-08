export const getCraftformDefinitionCode = (contractNames:string[]) => {
    const coreImports = `import { CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'`
    const imports = contractNames.map(name => `
import { ${name} } from '../${name}';
import { ${name}Args, ${name}Config } from './${name}.craft';
`.trim()).join('\n')

    const getFunctionDeclares = contractNames.map(name => `
        get(
            contractName: '${name}',
            props: GetContractProps
        ): Promise<Craft<${name}, ${name}Config>>
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