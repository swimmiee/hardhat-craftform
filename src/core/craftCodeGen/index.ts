import { HardhatRuntimeEnvironment } from "hardhat/types";
import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";
import { setConfigFiles } from "./configs";
import { SetProjectFileProps } from "./setProject.interface";
import { setCraftformHelperDefinition } from "./craftformHelperDefinition";
import { setDeployArgsFile } from "./deployArgs";
import { setCraftDefinitions } from "./craftDefinitions";
import { setCraftFactoryTypeFile } from "./craftFactoryType";


export default async function craftCodeGen(
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

    const typechainOutDir = hre.config.typechain.outDir;

    // craftform type definition file (idempotent)
    await setCraftformHelperDefinition(coreProps)

    // deploy args & proxy setting
    await setDeployArgsFile(coreProps, hre.userConfig.craftform?.initializer)

    // crafts definition
    await setCraftDefinitions(coreProps, typechainOutDir)

    // crafts factory definition
    await setCraftFactoryTypeFile(coreProps, typechainOutDir)

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