import { BaseConfig, Config, CraftLike } from "../../core"
import { Test2__factory } from "../fixture-projects/hardhat-project/typechain"

@Config()
export class Test2 implements BaseConfig {
    // required field
    address!: string

    // write down your extra config...
    test1!: string


}

export class Test2Craft extends Test2__factory implements CraftLike<Test2> {
    public static contractName = "Test2"
    config!: Test2
}