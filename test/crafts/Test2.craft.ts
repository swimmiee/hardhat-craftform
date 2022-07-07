import { BaseConfig, Config } from "../../core"

@Config()
export class Test2Config implements BaseConfig {
    // required field
    address!: string

    // write down your extra config...
    test1!: string

}