import { network } from "hardhat"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig"
import { ConfigUpdateable, UpdateConfigOption } from "../types"
import { _updateConfig } from "./config"

export class BaseConfig {
    address: string
    alias: string
    version: number
    deployedAt: number

    constructor(props: any & BaseConfig){
        Object.assign(this, props)
    }

    public update(
        updates: Partial<ConfigUpdateable<this>>,
        option: UpdateConfigOption
    ){
        const chain = option.chain || network.name

        _updateConfig({
            chain,
            contract: extractContractNameFromConfigName(
                    this.constructor.name
                ),
                alias: this.alias,
                version: this.version
            }, 
            updates,
            option.versioning
        )
    }
}