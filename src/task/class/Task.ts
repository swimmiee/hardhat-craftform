import chalk from "chalk";
import { Step } from "./Step";
import { TaskOptions } from "./TaskOptions";


export class Task<T> {
    title: string
    steps: Step<T>[]

    constructor(
        title: string,
    ){
        this.title = title;
        this.steps = []
    }

    addSteps(steps:Step<T>[]){
        this.steps = this.steps.concat(steps);
    }

    async execute(params:T, options?:TaskOptions){
        // @TODO log에 남기기
        let index = 1;
        for await (const step of this.steps) {
            console.log(`[STEP #${index}]`)
            console.log(chalk.blueBright(`*** ${step.title} ***`))

            const result = await step.execute(params)
            
            if(result){
                console.log(chalk.green(`✅ Succeed`))
            }
            else {
                console.log(chalk.red(`❌ Failed`))
                // @TODO
                // continue? 묻기
            }

            console.log()
            index++;
        }
    }
}