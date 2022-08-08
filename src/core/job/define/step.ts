import { Step, StepAction } from "../class";

export function step<T>(
    title: string,
    action: StepAction<T>,
    // @TODO 
    rollback?: (params:T) => Promise<void>
){
    return new Step(title, action);
}