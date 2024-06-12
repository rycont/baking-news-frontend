import { ContentProvidersResponse } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'
import { customElement, noShadowDOM } from 'solid-element'
import { createResource } from 'solid-js'
import { ProviderEditorView } from './index.view'

function ProviderEditor() {
    const [usingProviders] = createResource(getUsingProviders)

    function usingProviderNames() {
        return usingProviders()?.map((provider) => provider.name) || []
    }

    return <ProviderEditorView usingProviders={usingProviderNames()} />
}

async function getUsingProviders(): Promise<ContentProvidersResponse[]> {
    const me = await getMe.call()
    const usingProviders = me.expand?.using_providers

    if (!me) {
        location.href = '/login/index.html'
        throw new Error('Not logged in')
    }

    return usingProviders || []
}

const name = 'provider-editor'
customElement(name, () => {
    noShadowDOM()
    return <ProviderEditor />
})

export default name
