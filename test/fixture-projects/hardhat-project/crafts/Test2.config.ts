import { Contract, BaseConfig, Config } from "hardhat-craftform/dist/core"
import { Test2 } from "../typechain"


@Config()
export class Test2Config implements BaseConfig {

    // required field
    address!: string

    // write down your extra config...
}
 
// @TODO
type Test2Args = []
type Test2Craft = Test2 & {
    config: Test2Config
}
export type { Test2Args, Test2Craft }