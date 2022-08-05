import path from "path";
import chalk from "chalk";
import interceptor from "console-log-interceptor";
import { Step } from "./Step";
import { defaultOption, JobOptions } from "./JobOptions";
import { dateFormatter, timeFormatter, confirmPrompt, sleep } from "../../../utils";

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


    async execute(params:T, options?:JobOptions):Promise<boolean>{
        let succeed = true;

        // save log default: true
        const saveLog = options?.saveLog === false ? false : true
        if(saveLog){
            interceptor.intercept({datetime: options?.log?.datetime})
        }

        // default wait seconds = 5
        const waitSeconds = options?.wait === null ? 0 : (
            options?.wait || defaultOption.wait as number
        )

        let index = 1;
        for await (const step of this.steps) {

            await sleep(waitSeconds)

            console.log(`[STEP #${index}]`)
            console.log(chalk.blueBright(`*** ${step.title} ***`))

            try {
                const result = await step.execute(params)
                if(result){
                    console.log(chalk.green(`✅ Succeed`))
                }
                else throw Error(`Step [${step.title}] Failed`)
            } catch (error: any) {
                console.log(chalk.red(`❌ Failed`))
                if(!options?.continueOnFailed){
                    succeed = false;
                    console.log(error.message)
                    console.log(chalk.red('exit'))
                    break;
                }
            }
        

            // ask for continue
            if(options?.stepByStep){
                const ok = await confirmPrompt(
                    `Step [ ${step.title} ] is done. continue?`,
                    true
                )
                console.log()
                if(!ok)
                    break;
            }

            index++;
        }

        if(!saveLog)
            return succeed;
        // LOG Handling

        
        interceptor.stopIntercept()

        let configPath;
        // @TODO setup log path
        // try {
        //     const { config } = await import("hardhat")
        //     configPath = config.paths.logs
        // } catch (error) {
        //     configPath = 'logs'
        // }
        configPath = 'logs'

        const dirname = options?.log?.dirname || dateFormatter(new Date()); 
        const filename = options?.log?.filename ? 
            `${options.log.filename}.log` 
            : 
            `${timeFormatter(new Date())}.log`
        const logPath = path.join(configPath, dirname, filename)

        interceptor.save({
            path: logPath,
            append: true
        })
        interceptor.clear()
        console.log()

        return succeed;
    }
}