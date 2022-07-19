import { Step, StepAction } from "../class";

export function step<T>(
    title: string,
    action: StepAction<T>,
    message: string,
    // @TODO 
    rollback?: (params:T) => Promise<void>
){
    return new Step(title, action, message);
}