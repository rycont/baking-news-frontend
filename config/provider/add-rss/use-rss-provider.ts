import { pb } from '@/db'
import { Collections } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'

export async function useRSSProvider(providerId: string) {
    const me = await getMe()

    const newUsingProviders = [...me.using_providers, providerId]

    await pb.collection(Collections.Users).update(me.id, {
        using_providers: newUsingProviders,
    })
}
