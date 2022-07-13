import { network } from "hardhat"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig"
import { _updateConfig } from "./utils"

interface UpdateConfigOption {
    chain: string
    versioning: "upgrade" | "maintain"
}
export class BaseConfig {
    address: string
    alias: string
    version: number
    deployedAt: number

    constructor(props: any & BaseConfig){
        Object.assign(this, props)
    }

    public update(
        // @TODO
        updates: any,
        option: UpdateConfigOption
    ){
        const chain = option.chain || network.name

        if(option.versioning === "maintain"){
            console.log('contract name', extractContractNameFromConfigName(
                this.constructor.name
            ))
            _updateConfig({
                chain,
                contract: extractContractNameFromConfigName(
                    this.constructor.name
                ),
                alias: this.alias,
                version: this.version
            }, updates)
        }
        else {
            console.log("not implemented")
        }

    }
}