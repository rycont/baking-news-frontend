import { pb } from '@/db'
import { Collections } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'
import { createSignal } from 'solid-js'

export const getAllProviders = () =>
    pb.collection(Collections.ContentProviders).getFullList()

export const [usingProviderIds, setUsingProviderIds] = createSignal<string[]>(
    (await getMe.call()).using_providers
)
