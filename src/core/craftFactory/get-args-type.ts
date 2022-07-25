import { artifacts } from "hardhat"
import { Artifact } from "hardhat/types"
import { AbiParameter, parseEvmType, RawAbiDefinition } from "typechain"
import { CraftformInitializerFormat } from "../types"
import { generateTypes } from "./generate-type"
import { getArtifactInfo } from "./getArtifactInfo"


export const getContstructorArgsType = async (
    artifact:Artifact, 
    initializerFormat?: string | CraftformInitializerFormat
) => {
    let constr:RawAbiDefinition;
    
    // 1. find constructor
    constr = artifact.abi.find(
        abiItem => abiItem.type === "constructor"
    )

    // constructor이 없는 경우 ->
    // 1. 원래 없거나
    // 2. upgradeable이라 initializer가 있는 경우
    if(!constr){
        if(!initializerFormat){
            return []   // initializer format을 설정하지 않은 경우
        }
        else {
            const { contractName } = getArtifactInfo(artifact)
            const targetFormat = typeof initializerFormat === "string" ? 
                initializerFormat : 
                initializerFormat[contractName] || initializerFormat.default
    
            const targetInitializerName = targetFormat.replace("$", contractName)
            constr = artifact.abi.find(
                abiItem => abiItem.name === targetInitializerName
            )
            if(!constr)
                return []   // initializer 또한 없는 경우
        }
    }
    
    const abiParams = constr.inputs.map((input):AbiParameter => ({
        name: input.name,
        type: parseEvmType(input.type)
    }))
    return generateTypes(abiParams)
}