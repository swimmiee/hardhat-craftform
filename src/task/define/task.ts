import { Step, Task, TaskOptions } from "../class";

export function task<T>(
    title: string, 
    steps: Step<T>[]
):(args: T) => Promise<void>{
    const task = new Task<T>(title);
    task.addSteps(steps)

    async function executor(
        params: T,
        options?: TaskOptions
    ){
        await task.execute(params, options);
    }

    return executor;
}
