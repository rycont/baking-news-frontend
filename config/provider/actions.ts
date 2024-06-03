import { pb } from '@/db'
import { setUsingProviderIds, usingProviderIds } from './widgets/storage'
import { Collections } from '@/pocketbase-types'

export default {
    onChange(
        providerId: string,
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        }
    ) {
        if (!pb.authStore.model) {
            location.href = '/login/index.html'
            return
        }

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
        if (!pb.authStore.model) {
            location.href = '/login/index.html'
            return
        }

        setUsingProviderIds(newUsingProviderIds)

        await pb.collection(Collections.Users).update(pb.authStore.model.id, {
            using_providers: newUsingProviderIds,
        })
    },
}
