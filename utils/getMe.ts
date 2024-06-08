import { pb } from '../db'
import { ContentProvidersResponse, UsersResponse } from '../pocketbase-types'
import { assert } from './assert'
import { cache } from './cached'

export const getMe = cache(async function getMe() {
    try {
        assert(pb.authStore.model)
        const myId = pb.authStore.model.id

        const me = await pb.collection('users').getOne<
            UsersResponse<
                string[],
                {
                    using_providers: ContentProvidersResponse[]
                }
            >
        >(myId, {
            expand: 'using_providers',
        })

        return me
    } catch (e) {
        location.href = '/login/index.html'
    }
})
