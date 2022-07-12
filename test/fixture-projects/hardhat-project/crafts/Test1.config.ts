import { Contract, BaseConfig, Config, address } from "hardhat-craftform/dist/core"
import { BigNumber } from "ethers";

 
// args type for constructor or initializer
export type Test1Args = [BigNumber, address, string]

// Contract Config class
@Config()
export class Test1Config implements BaseConfig {

    // required field
    address!: string

    // write down your other custom configs...
}
