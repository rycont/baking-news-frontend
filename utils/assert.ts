export class AssertionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AssertionError'
    }
}

export function assert(
    condition: unknown,
    message = 'Assertion failed'
): asserts condition {
    if (condition) return
    throw new AssertionError(message)
}
