import { Artifact } from "hardhat/types"
import { parseEvmType, RawAbiDefinition } from "typechain"
import { getInitializer } from "../../utils"
import { CraftformInitializerFormat } from "../types"
import { generateTypes } from "./generateTypes"
import { getArtifactInfo } from "./getArtifactInfo"

interface DeployArgsTypeStrings {
    args: string[]
    proxy?: {
        methodName: string
        args: string[]
    }
}

/**
 * 
 * @param artifact 해당 컨트랙트의 artifact
 * @param initializerFormat craftform에 설정하는 initializerFormat. @TODO 기본을 __init_으로 할지?
 * 
 * case 1. initializer가 없는 함수 (constructor은 있을 수도 있고 없을 수도 있음)
 * case 2. initializer가 있는 함수
 */
export const getDeployArgsType = (
    artifact:Artifact, 
    initializerFormat?: string | CraftformInitializerFormat
):DeployArgsTypeStrings => {
    // 1. find constructor
    const constr:RawAbiDefinition | undefined = artifact.abi.find(
        abiItem => abiItem.type === "constructor"
    )

    let args: string[]
    if(constr){
        const constrParams = constr.inputs.map((input) => ({
            name: input.name,
            type: parseEvmType(input.type)
        }))
        args = generateTypes(constrParams);
    } 
    else {
        args = [];
    }

    const { contractName } = getArtifactInfo(artifact)
    const targetInitializerName = getInitializer(contractName, initializerFormat)
    if(!targetInitializerName){
        return { args } // initializer format을 설정하지 않은 경우:: Proxy 없이 리턴함.
    }

    const initializer:RawAbiDefinition = artifact.abi.find(
        abiItem => abiItem.name === targetInitializerName
    )
    if(!initializer){
        return { args }   // initializer이 없는 경우, case 1.
    }
    else {  // case 2.
        const initializerParams = initializer.inputs.map((input) => ({
            name: input.name,
            type: parseEvmType(input.type)
        }))
        return {
            args,
            proxy:{
                methodName: targetInitializerName,
                args: generateTypes(initializerParams)
            }
        }
    }
}