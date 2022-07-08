import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Project } from "ts-morph";
import { getConfigFiles } from "./config-files";
import { getCraftformDefinitionCode } from "./craftform-definition";

export default async function craftTypeFactory(hre: HardhatRuntimeEnvironment){
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
            getConfigFiles(contractName),
            {overwrite: true}
        );
    }

    // declare file
    project.createSourceFile(
        `${craftsRootDir}/craftform.d.ts`,
        getCraftformDefinitionCode(contractNames),
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