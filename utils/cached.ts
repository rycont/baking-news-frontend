export function cache<
    P extends [],
    R extends unknown,
    T extends (...arg0: P[]) => R
>(fn: T, duration: number = 1000 * 30): FunctionWithInvalidate<T> {
    let lastRun = 0
    let lastPromise: R | undefined

    const proxyFunction = function (...args: P) {
        const isInvalid = Date.now() - lastRun > duration

        if (!lastPromise || isInvalid) {
            lastPromise = fn(...args)
            lastRun = Date.now()
        }

        return lastPromise
    } as FunctionWithInvalidate<T>

    proxyFunction.invalidate = () => {
        lastRun = 0
    }

    return proxyFunction
}

type FunctionWithInvalidate<T> = T & {
    invalidate: () => void
}
