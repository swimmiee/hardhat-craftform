import { existsSync } from "fs"

export const isCraftInitiated = () => existsSync('crafts/index.ts')