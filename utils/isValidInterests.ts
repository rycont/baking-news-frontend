import { assert } from '../utils/assert'

export function isValidInterests(
    interests: unknown,
    config: {
        checkIsEmpty?: boolean
    } = {}
): interests is string[] {
    assert(Array.isArray(interests))

    for (const interest of interests) {
        assert(typeof interest === 'string')
    }

    if (config.checkIsEmpty) {
        assert(interests.length > 0)
    }

    return true
}
