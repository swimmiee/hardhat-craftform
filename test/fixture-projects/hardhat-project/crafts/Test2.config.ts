import { Contract, Config, address, BaseConfig } from "../../../../core"
import { BigNumberish } from "ethers";

 
// args type for constructor or initializer
export type Test2Args = [address]

// Contract Config class
@Config()
export class Test2Config extends BaseConfig {

    // write down your custom configs...
}
