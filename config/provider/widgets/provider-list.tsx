import { For } from 'solid-js'

import '@shade/elements/divider'
import '@shade/elements/chip'

import ProviderItem from './provider-item'
import { allProviders, idProviderMap, usingProviderIds } from './storage'
import { ContentProvidersResponse } from '@/pocketbase-types'
import { popAppearProgressiveStyle, popAppearStyle } from '@shade/theme.css'

function ProviderList() {
    return (
        <sh-vert gap={4}>
            <sh-horz gap={2} y="top" linebreak>
                <For each={getUsingProviders()}>
                    {(provider) => (
                        <sh-chip class={popAppearStyle}>
                            {provider.name}
                        </sh-chip>
                    )}
                </For>
            </sh-horz>
            <For each={allProviders}>
                {(provider) => (
                    <sh-vert gap={4} class={popAppearProgressiveStyle}>
                        <ProviderItem id={provider.id} />
                        <sh-divider></sh-divider>
                    </sh-vert>
                )}
            </For>
        </sh-vert>
    )
}

function getUsingProviders() {
    const providerIds = usingProviderIds()
    const usingProviders = providerIds
        .map((id) => idProviderMap.get(id))
        .filter<ContentProvidersResponse>(
            (provider): provider is ContentProvidersResponse =>
                provider !== undefined
        )

    return usingProviders
}

export default ProviderList
