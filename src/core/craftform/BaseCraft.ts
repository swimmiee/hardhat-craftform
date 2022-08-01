import { Contract, ContractInterface } from "ethers"
import { BaseConfig } from "../craftform/BaseConfig";

export class BaseCraft<Config extends BaseConfig> extends Contract {
    $config: Config
    constructor(contract: string, contractInterface: ContractInterface, _config: Config){
        super(contract, contractInterface);
        this.$config = _config;
    }
}