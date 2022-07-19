import { InterceptorOption } from "console-log-interceptor"

export interface JobOptions extends InterceptorOption {
    stepByStep?: boolean
    saveLog?: boolean
    log?: {
        dirname?: string
        filename?: string
    }
}

export const defaultOption: JobOptions = {
    // stepByStep: 
}