import { Contract, BaseConfig, Config } from "hardhat-craftform/dist/core"
import { Test1 } from "../typechain"


@Config()
export class Test1Config implements BaseConfig {

    // required field
    address!: string

    // write down your extra config...
}
 
// @TODO
type Test1Args = []
type Test1Craft = Test1 & {
    config: Test1Config
}
export type { Test1Args, Test1Craft }