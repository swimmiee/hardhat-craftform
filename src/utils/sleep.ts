export function sleep(second: number) {
    if(second <= 0)
        return;
    return new Promise((r) => setTimeout(r, second * 1000));
}