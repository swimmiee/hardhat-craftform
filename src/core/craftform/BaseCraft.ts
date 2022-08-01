import { Contract, ContractInterface } from "ethers"
import { BaseConfig } from "../craftform/BaseConfig";

export class BaseCraft<Config extends BaseConfig> extends Contract {
    $config: Config
    constructor(address: string, contractInterface: ContractInterface, _config: Config){
        super(address, contractInterface);
        this.$config = _config;
    }
}