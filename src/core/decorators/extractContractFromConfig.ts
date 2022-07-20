export const extractContractNameFromConfigName = (className: string) => {
    const postfix = "Config"
    const indexOf = className.lastIndexOf(postfix);
    if(indexOf !== className.length - postfix.length){
        throw Error(`Config Class name must end with "${postfix}".`)
    }
    
    return className.slice(0, indexOf)
}