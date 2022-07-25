export function clone<T>(origin: T){
    const cloned:T = Object.assign(Object.create(Object.getPrototypeOf(origin)), origin)
    return cloned
}