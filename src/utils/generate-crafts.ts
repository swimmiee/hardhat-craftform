import hre from "hardhat"
import { Project } from "ts-morph";


export default async function GenerateCrafts(){
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

        const craftClassFile = project.createSourceFile(
            `${craftsRootDir}/${artifactName}.craft.ts`,
            getCraftFileContent(contractName)
        );
    }

    // for clean import
    project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        contractNames.map(name => {
            return `export * from './${name}'`
        }).join('\n')
    );
    
    await project.save()
}

/**
 * @Craft() Mock
 */

const getCraftFileContent = (contractName:string) => `
import { Craft, Contract } from "hardhat-craftform/dist/core"

@Craft()
export class ${contractName} {
    // address of contract
    address!: string

    /**
     * Try to use @Contract() decorator!
     * /
}`