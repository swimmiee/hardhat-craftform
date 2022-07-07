
import { Contract, BaseConfig, Config, CraftLike } from "../../core"
import type { Test1 as Test1Contract } from "../fixture-projects/hardhat-project/typechain/Test1"
import { Test2 } from "./Test2.craft"

@Config()
export class Test1 implements BaseConfig {
    // required field
    address!: string

    // write down your extra config...
    @Contract(Test2)
    test2!: Test2

}

// @Craft(factory )
export class Test1Craft implements CraftLike<Test1> {
    public static contractName = "Test1"
    config!: Test1
}