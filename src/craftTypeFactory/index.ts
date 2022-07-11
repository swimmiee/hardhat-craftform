import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Project } from "ts-morph";
import { getConfigFiles } from "./config-files";
import { getCraftformDefinitionCode } from "./craftform-definition";

export default async function craftTypeFactory(
    hre: HardhatRuntimeEnvironment,
    resetConfigs: boolean
){
    const craftsRootDir = hre.config.paths.crafts;
    const artifacts = hre.artifacts

    const artifactNames = await artifacts.getAllFullyQualifiedNames()
    // ex of artifactName:: contracts/Test2.sol:Test2
    if(!artifactNames.length){
        return;
    }

    const contractNames:string[] = []
    for (const artifactName of artifactNames) {
        const [folder] = artifactName.split('/')
        if(folder === 'hardhat')   // only for contract
            continue;

        const _splited = artifactName.split(':')
        const contractName = _splited[_splited.length - 1]
        contractNames.push(contractName)
    }

    /// Start project setup

    const project = new Project({})

    project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);


    // craftform type definition file (idempotent)
    project.createSourceFile(
        `${craftsRootDir}/craftform.d.ts`,
        getCraftformDefinitionCode(contractNames),
        {overwrite: true}
    )
    console.log(`set ${craftsRootDir}/craftform.d.ts`)

    if(!resetConfigs)
        return;

    // config.ts 파일들을 모두 초기화함!!
    contractNames.forEach(contractName => {
        const configClassFile = project.createSourceFile(
            `${craftsRootDir}/${contractName}.config.ts`,
            getConfigFiles(contractName),
            {overwrite: true}
        );
    })
    console.log(`Config files created at: ./${craftsRootDir}`)


    // for clean import
    project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        `export * from 'craftform.d'\n` +
        contractNames.map(name => {
            return `export * from './${name}.config'`
        }).join('\n'),
        {overwrite: true}
    );

    await project.save()
}