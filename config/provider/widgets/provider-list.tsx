import { For, Match, Switch, createResource } from 'solid-js'

import '@shade/elements/divider'
import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import '@shade/elements/chip'

import ProviderItem from './provider-item'
import {
    getAllProviders,
    setUsingProviderIds,
    usingProviderIds,
} from './storage'
import { popAppearProgressiveStyle, popAppearStyle } from '@shade/theme.css'
import { Collections, ContentProvidersResponse } from '@/pocketbase-types'
import { pb } from '@/db'
import actions from '../actions'

function ProviderList() {
    const [allProviders] = createResource(getAllProviders)

    return (
        <Switch fallback={<Spinner color="var(--bk-color-l4)" />}>
            <Match when={allProviders.state === 'ready'}>
                <sh-vert gap={4}>
                    <sh-horz gap={2} y="top" linebreak>
                        <For each={getUsingProviders(allProviders())}>
                            {(provider) => (
                                <sh-chip class={popAppearStyle}>
                                    {provider.name}
                                </sh-chip>
                            )}
                        </For>
                    </sh-horz>
                    <For each={allProviders()}>
                        {(provider) => (
                            <sh-vert gap={4} class={popAppearProgressiveStyle}>
                                <ProviderItem
                                    name={provider.name}
                                    url={provider.url}
                                    enabled={usingProviderIds().includes(
                                        provider.id
                                    )}
                                    onChange={actions.onChange.bind(
                                        actions,
                                        provider.id
                                    )}
                                />
                                <sh-divider></sh-divider>
                            </sh-vert>
                        )}
                    </For>
                </sh-vert>
            </Match>
        </Switch>
    )
}

function getUsingProviders(allProviders?: ContentProvidersResponse[]) {
    if (!allProviders) {
        return null
    }
    const providerIds = usingProviderIds()

    return allProviders.filter((provider) => providerIds.includes(provider.id))
}

export default ProviderList
