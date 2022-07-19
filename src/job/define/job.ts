import { Step, Job, JobOptions } from "../class";

export function job<T>(
    title: string, 
    steps: Step<T>[]
):(args: T) => Promise<void>{
    const task = new Job<T>(title);
    task.addSteps(steps)

    async function executor(
        params: T,
        options?: JobOptions
    ){
        await task.execute(params, options);
    }

    return executor;
}
