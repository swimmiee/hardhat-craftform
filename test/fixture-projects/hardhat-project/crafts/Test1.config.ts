import { Contract, Config, address, BaseConfig } from "../../../../"
import { BigNumberish } from "ethers";

 
// args type for constructor or initializer
export type Test1Args = [BigNumberish, address, string]

// Contract Config class
@Config()
export class Test1Config extends BaseConfig {

    // write down your custom configs...
}
