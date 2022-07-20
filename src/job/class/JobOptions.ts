import { InterceptorOption } from "console-log-interceptor"

export interface LogOptions extends InterceptorOption {
    dirname?: string
    filename?: string
}
export interface JobOptions  {
    stepByStep?: boolean        // if true, cli asks you to continue at the end of each step
    continueOnFailed?: boolean  // if true, not break on step failed
    saveLog?: boolean           // default true
    wait?: number | null               // default: 5, wait N seconds before each step starts.
    log?: LogOptions
}

export const defaultOption: JobOptions = {
    stepByStep: true,
    continueOnFailed: false,
    saveLog: true,
    wait: 5,
} as const