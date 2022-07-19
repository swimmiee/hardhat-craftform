import chalk from "chalk";
import interceptor from "console-log-interceptor";
import { Step } from "./Step";
import { JobOptions } from "./JobOptions";
import { dateFormatter, timeFormatter } from "../../utils/datetime-formatter";
import path from "path";


export class Job<T> {
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

    async execute(params:T, options?:JobOptions){
        // save log default: true
        const saveLog = options?.saveLog === false ? false : true
        if(saveLog){
            interceptor.intercept(options)
        }

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


        let configPath;
        try {
            const { config } = await import("hardhat")
            configPath = config.paths.logs
        } catch (error) {
            configPath = 'logs'
        }
        // configPath = 'logs'

        const dirname = options?.log?.dirname || dateFormatter(new Date()); 
        const filename = options?.log?.filename + '.log' || `${timeFormatter(new Date())}.log`
        const logPath = path.join(configPath, dirname, filename)

        interceptor.save({
            path: logPath,
            append: true
        })
        interceptor.clear()
    }
}