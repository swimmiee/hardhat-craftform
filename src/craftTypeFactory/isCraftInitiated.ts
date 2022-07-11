import { existsSync } from "fs"

export const isCraftInitiated = () => {
    console.log(existsSync('/crafts/index.ts'))
    console.log(existsSync('/crafts'))
    console.log(existsSync('crafts/index.ts'))
    console.log(existsSync('crafts'))

    return existsSync('/crafts/index.ts')
}