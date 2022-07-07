import { Craft, Contract } from "../../core"
import { Test2 } from "./Test2.craft"

@Craft()
export class Test1 {

    @Contract(craft => Test2)
    test2!: Test2
}