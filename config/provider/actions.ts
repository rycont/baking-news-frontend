import { pb } from '@/db'
import { setUsingProviderIds, usingProviderIds } from './widgets/storage'
import { Collections } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'

export default {
    async onChange(
        providerId: string,
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        }
    ) {
        await getMe.call()

        const modification = e.target.checked ? 'add' : 'remove'

        if (modification === 'add') {
            this.addProviderToUsingList(providerId)
        } else {
            this.removeProviderFromUsingList(providerId)
        }
    },
    addProviderToUsingList(id: string) {
        let newUsingProviderIds = usingProviderIds()
        newUsingProviderIds = [...newUsingProviderIds, id]

        this.saveProviderList(newUsingProviderIds)
    },
    removeProviderFromUsingList(id: string) {
        let newUsingProviderIds = usingProviderIds()
        newUsingProviderIds = newUsingProviderIds.filter(
            (providerId) => providerId !== id
        )

        this.saveProviderList(newUsingProviderIds)
    },
    async saveProviderList(newUsingProviderIds: string[]) {
        const me = await getMe.call()
        setUsingProviderIds(newUsingProviderIds)

        await pb.collection(Collections.Users).update(me.id, {
            using_providers: newUsingProviderIds,
        })
    },
}
