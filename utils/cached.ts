// Implement `CachedFunction` class that caches the result of a function call for a given time period, in typescript.
// The class should have the following methods:
// - `constructor` - accepts a function and a cache time in milliseconds
// - `call` - calls the function and caches the result for the given time period
// - `clear` - clears the cache

export class CachedFunction<Args, Return> {
    private cacheDuration: number
    private lastCall: number
    private cache: Return | null

    static DEFAULT_CACHE_TIME = 1000 * 30

    constructor(
        private fn: (...args: Args[]) => Return,
        cacheTime: number = CachedFunction.DEFAULT_CACHE_TIME
    ) {
        this.cacheDuration = cacheTime
        this.cache = null
        this.lastCall = 0
    }

    call(): ReturnType<typeof this.fn> {
        const now = Date.now()
        if (now - this.lastCall > this.cacheDuration || this.cache === null) {
            this.cache = this.fn()
            this.lastCall = now
        }
        return this.cache
    }

    clearCache() {
        this.cache = null
    }
}
