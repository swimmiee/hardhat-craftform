import { Contract, BaseConfig, Config, address } from "hardhat-craftform/dist/core"
import { BigNumber } from "ethers";

 
// args type for constructor or initializer
export type Test2Args = [address]

// Contract Config class
@Config()
export class Test2Config implements BaseConfig {

    // required field
    address!: string

    // write down your other custom configs...
}
