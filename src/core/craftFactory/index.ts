import { HardhatRuntimeEnvironment } from "hardhat/types";
import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";
import { setConfigFiles } from "./configFiles";
import { SetProjectFileProps } from "./setProject.interface";
import { setCraftformHelperDefinition } from "./craftformHelperDefinition";
import { setDeployArgsFile } from "./deployArgsFile";
import { setCraftsDefinition } from "./craftsDefinition";


export default async function craftTypeFactory(
    hre: HardhatRuntimeEnvironment,
    resetConfigs: boolean
){
    const craftsRootDir = hre.config.paths.crafts;
    const hreArtifacts = hre.artifacts

    const artifactNames = await hreArtifacts.getAllFullyQualifiedNames()

    const artifacts = artifactNames
        .map(name => hreArtifacts.readArtifactSync(name))
        .filter( a => a.abi.length > 0 && a.bytecode !== '0x')

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
    await setCraftformHelperDefinition(coreProps)

    // args proxy setting
    await setDeployArgsFile(coreProps, hre.userConfig.craftform?.initializer)

    // crafts definition
    await setCraftsDefinition(coreProps)

    // resetConfigs=true이면 config.ts 파일들을 모두 초기화함!!
    await setConfigFiles(coreProps, resetConfigs)


    const indexFile = coreProps.project.createSourceFile(
        `${craftsRootDir}/index.ts`,
        "",
        { overwrite: true }
    )

    indexFile.addExportDeclarations([
        { moduleSpecifier: './craftform.helper' },
        { moduleSpecifier: './deploy.args' },
        { moduleSpecifier: './configs' },
        { moduleSpecifier: './crafts' },
    ])

    await indexFile.save()
}