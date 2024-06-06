import { For, Match, Switch, createResource } from 'solid-js'
import { noShadowDOM } from 'solid-element'

import { ContentProvidersResponse } from '@/pocketbase-types'

import { popAppearProgressiveStyle, popAppearStyle } from '@shade/theme.css'
import Spinner from '@shade/icons/animated/spinner.svg?component-solid'

import '@shade/elements/divider'
import '@shade/elements/chip'

import actions from '../actions'

import { getAllProviders, usingProviderIds } from './storage'
import ProviderItem from './provider-item'

function ProviderList() {
    noShadowDOM()
    const [allProviders] = createResource(getAllProviders)

    return (
        <Switch
            fallback={
                <sh-vert x="center" y="center" data-filly>
                    <Spinner color="var(--bk-color-l4)" />
                </sh-vert>
            }
        >
            <Match when={allProviders.state === 'ready'}>
                <sh-vert gap={4} scroll fade>
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
                <sh-horz gap={2} x="center" y="top" linebreak>
                    <For each={getUsingProviders(allProviders())}>
                        {(provider) => (
                            <sh-chip class={popAppearStyle}>
                                {provider.name}
                            </sh-chip>
                        )}
                    </For>
                </sh-horz>
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
