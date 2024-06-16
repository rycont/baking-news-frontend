import { Result } from '@/types/result'
import { getInterests, getUsingProvider } from './storage'

export function isPrepared(): Result<
    null,
    'no-interests' | 'no-using-providers'
> {
    const interests = getInterests()

    if (!interests || interests.length === 0) {
        return {
            success: false,
            error: 'no-interests',
        }
    }

    const usingProviders = getUsingProvider()

    if (!usingProviders || usingProviders.length === 0) {
        return {
            success: false,
            error: 'no-using-providers',
        }
    }

    return {
        success: true,
    }
}
