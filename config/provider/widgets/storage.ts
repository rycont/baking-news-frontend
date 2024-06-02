import { pb } from '@/db'
import { Collections } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'
import { createSignal } from 'solid-js'

export const allProviders = await pb
    .collection(Collections.ContentProviders)
    .getFullList()

export const idProviderMap = new Map(
    allProviders.map((provider) => [provider.id, provider])
)

export const [usingProviderIds, setUsingProviderIds] = createSignal<string[]>(
    (await getMe()).using_providers
)
