import { popAppearProgressiveStyle } from '@shade/theme.css'
import { smallText } from '@shade/elements/typo/style.css'

import { ContentProvidersResponse } from '@/pocketbase-types'

import { getElements } from '@utils/getElements'
import { getMe } from '@utils/getMe'

import { providerListItemStyle } from './style.css'

renderProvider()

const elements = getElements({
    providers: HTMLDivElement,
})

async function renderProvider() {
    const usingProviders = await getUsingProviders()
    usingProviders.forEach(renderProviderChip)
}

async function getUsingProviders(): Promise<ContentProvidersResponse[]> {
    const me = await getMe()
    const usingProviders = me.expand?.using_providers

    if (!me) {
        location.href = '/login/index.html'
        throw new Error('Not logged in')
    }

    return usingProviders || []
}

function renderProviderChip(provider: ContentProvidersResponse) {
    const providerCard = document.createElement('div')

    providerCard.classList.add(
        providerListItemStyle,
        smallText,
        popAppearProgressiveStyle
    )

    const providerName = document.createTextNode(provider.name)
    providerCard.appendChild(providerName)

    elements.providers.appendChild(providerCard)
}
