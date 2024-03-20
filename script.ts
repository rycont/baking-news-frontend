import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { isValidInterests } from './utils/isValidInterests'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const interests = await getInterestsAssuredly()
const providers = await getProvidersAssuredly()

async function getInterestsAssuredly() {
    const me = await getMe()
    const { interests } = me

    if (!interests) {
        location.href = '/setting-required/index.html'
        throw new Error('Redirecting to setting-required')
    }

    assert(
        isValidInterests(interests, {
            checkIsEmpty: true,
        })
    )

    return interests
}

async function getProvidersAssuredly() {
    const me = await getMe()
    const providers = me.using_providers

    assert(Array.isArray(providers))
    assert(providers.length > 0)

    return providers
}
