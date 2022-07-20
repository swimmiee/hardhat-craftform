import chalk from "chalk"

export type StepAction<T> = (args:T) => (boolean | Promise<boolean>)
export class Step<T> {
    title: string
    action: StepAction<T>
    message: string

    async execute(args:T){
        try {
            const result = Promise.resolve(this.action(args))
            return result
        } catch(e: any){
            console.log(e.message)
            return false;
        }
    }

    constructor(title: string, action: StepAction<T>, message: string){
        this.title = title;
        this.action = action;
        this.message = message;
    }

}