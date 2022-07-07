
import { Contract, BaseConfig, Config } from "../../core"
import { Test1 } from "../fixture-projects/hardhat-project/typechain"
import { Test2Config } from "./Test2.craft"


@Config()
export class Test1Config implements BaseConfig {

    // required field
    address!: string

    // write down your extra config...
    @Contract(Test2Config)
    test2!: Test2Config
}

type Test1Craft = Test1 & {
    config: Test1Config
}
export type { Test1Craft }