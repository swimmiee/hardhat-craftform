import { network } from "hardhat"
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig"
import { ExcludedBaseConfig, UpdateConfigOption, _updateConfig } from "./utils"

export class BaseConfig {
    address: string
    alias: string
    version: number
    deployedAt: number

    constructor(props: any & BaseConfig){
        Object.assign(this, props)
    }

    public update<Config extends BaseConfig>(
        updates: Partial<ExcludedBaseConfig<Config>>,
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