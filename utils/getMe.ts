import { pb } from '../db'
import { assert } from './assert'
import { cache } from './cached'

export const getMe = cache(async function getMe() {
    assert(pb.authStore.model)
    const myId = pb.authStore.model.id

    const me = await pb.collection('users').getOne(myId)
    return me
})
