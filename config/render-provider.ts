import { pb } from '../db'
import { assert } from '../utils/assert'
import { getMe } from '../utils/getMe'

const elements = getElements()

const usingProviders = await getUsingProviders()
const allProviders = await getProviders()

await render()

async function render() {
    for (const provider of allProviders) {
        const name = provider.name
        const id = provider.id
        const isUsing = usingProviders.has(provider.id)

        const instance = createItemElement(name, id, isUsing)

        elements.grid.appendChild(instance)
    }
}

async function getUsingProviders() {
    const me = await getMe()
    const usingProviders = me.using_providers

    return new Set(usingProviders)
}

function onCheckboxClicked(event: Event, id: string) {
    if (!(event.target instanceof HTMLInputElement)) {
        return
    }

    const checked = event.target.checked

    if (checked) {
        usingProviders.add(id)
    } else {
        usingProviders.delete(id)
    }

    updateUsingProviders()
}

async function updateUsingProviders() {
    assert(pb.authStore.model)
    const myId = pb.authStore.model.id

    const result = await pb.collection('users').update(myId, {
        using_providers: Array.from(usingProviders),
    })

    result.using_providers
}

function getElements() {
    const template = document.getElementById(
        'provider_item'
    ) as HTMLTemplateElement
    const grid = document.getElementById('provider_grid') as HTMLDivElement

    return { template, grid }
}

async function getProviders() {
    const allProviders = await pb.collection('content_providers').getFullList({
        sort: '-name',
    })

    return allProviders
}

function createItemElement(
    providerName: string,
    providerId: string,
    isUsing: boolean
) {
    const instance = elements.template.content.cloneNode(
        true
    ) as DocumentFragment

    const nameElement = instance.querySelector('.name') as HTMLSpanElement
    nameElement.appendChild(document.createTextNode(providerName))

    const input = instance.querySelector('input') as HTMLInputElement
    input.name = `provider_${providerId}`

    if (isUsing) {
        input.checked = true
    }

    input.addEventListener('change', (event) =>
        onCheckboxClicked(event, providerId)
    )

    return instance
}
