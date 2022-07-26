import { HardhatRuntimeEnvironment } from "hardhat/types";
import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";
import { setConfigFiles } from "./configFiles";
import { SetProjectFileProps } from "./setProject.interface";
import { setCraftformDefinition } from "./craftformDefinition";


export default async function craftTypeFactory(
    hre: HardhatRuntimeEnvironment,
    resetConfigs: boolean
){
    const craftsRootDir = hre.config.paths.crafts;
    const hreArtifacts = hre.artifacts

    const artifactNames = await hreArtifacts.getAllFullyQualifiedNames()

    const artifacts = artifactNames
        .map(name => hreArtifacts.readArtifactSync(name))
        .filter( a => a.abi.length > 0)

    /**
     *  SetProjectFileProps setting
     */
    const coreProps:SetProjectFileProps = {
        artifacts,
        craftsRootDir,
        project: new Project({
            manipulationSettings: {
                indentationText: IndentationText.FourSpaces,
                newLineKind: NewLineKind.LineFeed,
                quoteKind: QuoteKind.Single,
                usePrefixAndSuffixTextForRename: false,
                useTrailingCommas: false,
            },
        })
    }
    coreProps.project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);


    // craftform type definition file (idempotent)
    await setCraftformDefinition(coreProps)

    if(resetConfigs){
        // config.ts 파일들을 모두 초기화함!!
        await setConfigFiles(coreProps, hre.userConfig.craftform?.initializer)
    }
}