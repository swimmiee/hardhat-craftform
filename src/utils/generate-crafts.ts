import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Project } from "ts-morph";


export default async function GenerateCrafts(hre: HardhatRuntimeEnvironment){
    const craftsRootDir = hre.config.paths.crafts;
    const artifacts = hre.artifacts

    const artifactNames = await artifacts.getAllFullyQualifiedNames()
    // ex of artifactName:: contracts/Test2.sol:Test2
    if(!artifactNames.length){
        return;
    }
    const project = new Project({})

    // To create index.ts for clean import
    const contractNames:string[] = [];

    project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);
    for (const artifactName of artifactNames) {
        const [folder] = artifactName.split('/')
        if(folder === 'hardhat')   // only for contract
            continue;

        const _splited = artifactName.split(':')
        const contractName = _splited[_splited.length - 1]
        contractNames.push(contractName)

        const configClassFile = project.createSourceFile(
            `${craftsRootDir}/${contractName}.craft.ts`,
            getConfigFileContent(contractName),
            {overwrite: true}
        );
    }

    // declare file
    project.createSourceFile(
        `${craftsRootDir}/craftform.d.ts`,
        getDeclareFileContent(contractNames),
        {overwrite: true}
    )

    // for clean import
    project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        contractNames.map(name => {
            return `export * from './${name}.craft'`
        }).join('\n'),
        {overwrite: true}
    );
    
    await project.save()
}

/**
 * @Config() Mock
 */

const getConfigFileContent = (contractName:string) => 
`import { Contract, BaseConfig, Config } from "hardhat-craftform/dist/core"
import { ${contractName} } from "../typechain"


@Config()
export class ${contractName}Config implements BaseConfig {

    // required field
    address!: string

    // write down your extra config...
}

// @TODO
type ${contractName}Args = []
type ${contractName}Craft = ${contractName} & {
    config: ${contractName}Config
}
export type { ${contractName}Args, ${contractName}Craft }`


const getDeclareFileContent = (contractNames:string[]) => {
    const coreImports = `import { CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'`
    const imports = contractNames.map(name => {
        return `import { ${name}Args } from './${name}.craft'`
    }).join('\n')

    const getFunctionDeclares = contractNames.map(name => {
        return (`
    get(
        contractName: '${name}',
        props: GetContractProps
    ): Promise<void>`
        )
    }).join('\n')

    const deployFunctionDeclares = contractNames.map(name => {
        return (`
    deploy(
        contractName: '${name}',
        options: CraftDeployOptions<${name}Args>
    ): Promise<void>`
        )
    }).join('\n')

    return(
`${coreImports}
${imports}


interface CraftformHelper {
    ${getFunctionDeclares}

    ${deployFunctionDeclares}
}


declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        craftform: CraftformHelper
    }
}
`)};