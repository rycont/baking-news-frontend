import { createResource } from 'solid-js'
import { getMe } from '@utils/getMe'

const [interests, { mutate }] = createResource(getInterests)

async function getInterests() {
    const me = await getMe.call()
    console.log(getMe)
    const interests = me.interests || []

    return interests
}

export const interestsSignal = {
    get: interests,
    set: mutate,
}
