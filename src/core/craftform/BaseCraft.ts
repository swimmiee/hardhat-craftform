import { Contract, ContractInterface, Signer, providers } from "ethers"
import { BaseConfig } from "../craftform/BaseConfig";

export class BaseCraft<Config extends BaseConfig> extends Contract {
    $config: Config
    constructor(
        address: string, 
        contractInterface: ContractInterface, 
        signerOrProvider: Signer | providers.Provider, 
        _config: Config){
        super(address, contractInterface, signerOrProvider);
        this.$config = _config;
    }
}