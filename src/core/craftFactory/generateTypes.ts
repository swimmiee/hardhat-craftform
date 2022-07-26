import { compact } from "lodash"
import { AbiOutputParameter, AbiParameter, EvmOutputType } from "typechain"


export const generateTypes = (abiParams:AbiParameter[]) => {
    return abiParams.map(p => generateType(p.type))
}

export function generateType(evmType: EvmOutputType):string{
     switch (evmType.type) {
        case 'integer':
        case 'uinteger':
            return evmType.bits <= 48 ? 'number' : 'BigNumberish'
        case 'address':
            return 'address'
        case 'void':
            return 'void'
        case 'bytes':
        case 'dynamic-bytes':
            return 'string'
        case 'array':
            return generateArrayOrTupleType(generateType(evmType.itemType), evmType.size)
        case 'boolean':
            return 'boolean'
        case 'string':
            return 'string'
        case 'tuple':
            return generateOutputComplexType(evmType.components)
        case 'unknown':
            return  'any'
    }
}

function generateOutputComplexType(components: AbiOutputParameter[]) {
    const existingOutputComponents = compact([
      generateOutputComplexTypeAsArray(components),
      generateOutputComplexTypesAsObject(components),
    ])
    return existingOutputComponents.join(' & ')
}

function generateOutputComplexTypeAsArray(
    components: AbiOutputParameter[]
  ): string {
    return `[${components.map((t) => generateType(t.type)).join(', ')}]`
  }
  
  export function generateOutputComplexTypesAsObject(
    components: AbiOutputParameter[]
  ): string | undefined {
    let namedElementsCode
    const namedElements = components.filter((e) => !!e.name)
    if (namedElements.length > 0) {
      namedElementsCode =
        '{' + namedElements.map((t) => `${t.name}: ${generateType(t.type)}`).join(', ') + ' }'
    }
  
    return namedElementsCode
  }

function generateArrayOrTupleType(item: string, length?: number) {
    if (length !== undefined && length < 6) {
      return `[${Array(length).fill(item).join(', ')}]`
    } else {
      return `${item}[]`
    }
}