import { InterceptorOption } from "console-log-interceptor"

export interface TaskOptions extends InterceptorOption {
    stepByStep?: boolean
    saveLog?: boolean
}

export const defaultOption: TaskOptions = {
    // stepByStep: 
}