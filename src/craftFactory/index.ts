import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Project } from "ts-morph";
import { setConfigFiles } from "./config-files";
import { SetProjectFileProps } from "./set-project.interface";
import { setCraftformDefinition } from "./craftform-definition";


export default async function craftTypeFactory(
    hre: HardhatRuntimeEnvironment,
    resetConfigs: boolean
){
    const craftsRootDir = hre.config.paths.crafts;
    const artifacts = hre.artifacts

    /**
     *  SetProjectFileProps setting
     */
    const coreProps:SetProjectFileProps = {
        artifacts,
        craftsRootDir,
        project: new Project({}),
        contractNames: [],
        contractToArtifactMap: {}
    }
    coreProps.project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);

    const artifactNames = await artifacts.getAllFullyQualifiedNames()
    // ex of artifactName:: contracts/Test2.sol:Test2
    if(!artifactNames.length){
        return;
    }

    // set Props
    for (const artifactName of artifactNames) {
        const [folder] = artifactName.split('/')
        if(folder === 'hardhat')   // only for contract
            continue;

        const _splited = artifactName.split(':')
        const contractName = _splited[_splited.length - 1]
        coreProps.contractNames.push(contractName)
        coreProps.contractToArtifactMap[contractName] = artifactName
    }

    // craftform type definition file (idempotent)
    await setCraftformDefinition(coreProps)

    if(resetConfigs){
        // config.ts 파일들을 모두 초기화함!!
        await setConfigFiles(coreProps, hre.userConfig.craftform?.initializer)
    }
}