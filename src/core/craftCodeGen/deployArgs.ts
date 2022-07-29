import { OptionalKind, TypeAliasDeclarationStructure } from "ts-morph";
import { CraftformInitializerFormat } from "../types";
import { getDeployArgsType } from "./getDeployArgsType";
import { SetProjectFileProps } from "./setProject.interface";

export const setDeployArgsFile = async ({
    artifacts, 
    project, 
    craftsRootDir
}:SetProjectFileProps, initializerFormat?: string | CraftformInitializerFormat) => {

    if(!initializerFormat)
    console.log('\x1b[43m','WARN:: craftform.initializer in hardhat.config.ts is not set. \x1b[0m');

    // for clean import
    const dest = `${craftsRootDir}/deploy.args.ts`;
    const deployArgsFile = project.createSourceFile(dest, "", { overwrite: true })

    deployArgsFile.addImportDeclarations([
        {
            namedImports: ["DeployArgs", "ProxyProps", "address"],
            moduleSpecifier: "hardhat-craftform/dist/core"
        },
        {
            namespaceImport: "Configs",
            moduleSpecifier: "./configs"
        },
        {
            namedImports: ["BigNumberish"],
            moduleSpecifier: "ethers"
        }
    ])

    deployArgsFile.addStatements("// argsType for constructor or initializer")
    artifacts.map(async artifact => {
        const { contractName } = artifact
        const deployArgsTypes = getDeployArgsType(
            artifact,
            initializerFormat
        )

        // deploy args type
        deployArgsFile.addStatements(`// ${contractName}`)
        let typeAliases:OptionalKind<TypeAliasDeclarationStructure>[] = []
        typeAliases.push({
            name: `${contractName}Args`,
            type: `[${deployArgsTypes.args.join(', ')}]`,
            isExported: true
        })
        // proxy 있는 경우
        if(deployArgsTypes.proxy){
            typeAliases = typeAliases.concat([
                {
                    name: `${contractName}ProxyProps`,
                    type: `ProxyProps<"${deployArgsTypes.proxy.methodName}",[${deployArgsTypes.proxy.args.join(', ')}]>`,
                    isExported: true
                },
                {
                    name: `${contractName}DeployArgs`,
                    type: `DeployArgs<${contractName}Args, ${contractName}ProxyProps>`,
                    isExported: true
                }
            ])
        }
        // proxy 없는 경우
        else {
            typeAliases.push({
                name: `${contractName}DeployArgs`,
                type: `DeployArgs<${contractName}Args>`,
                isExported: true
            })
        }
        deployArgsFile.addTypeAliases(typeAliases)
    })
    console.log(`Deploy Arguments file was created at: ${dest}`)

    await project.save()
}