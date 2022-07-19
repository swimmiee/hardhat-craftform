import { config } from "hardhat"
import chalk from "chalk";
import interceptor from "console-log-interceptor";
import { Step } from "./Step";
import { TaskOptions } from "./TaskOptions";
import { dateFormatter, timeFormatter } from "../../utils/datetime-formatter";


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
        // save log default: true
        const saveLog = options ? options.saveLog : true
        if(saveLog)
            interceptor.intercept(options)

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

        if(!saveLog)
            return;
        // LOG Handling
        interceptor.stopIntercept()

        const date = dateFormatter(new Date())
        const logFilename = `${timeFormatter(new Date())}.log`
        interceptor.save({
            path: `${config.paths.logs}/${date}/${logFilename}`,
            append: true
        })
        interceptor.clear()
    }
}