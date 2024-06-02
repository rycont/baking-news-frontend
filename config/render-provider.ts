import { getElements } from '@utils/getElements'
import { getMe } from '../utils/getMe'
import { Result } from '@/types/result'
import { ContentProvidersResponse } from '@/pocketbase-types'
import { providerListItemStyle } from './style.css'
import { smallText } from '@shade/elements/typo/style.css'

const elements = getElements({
    providers: HTMLDivElement,
})

const usingProvidersResult = await getUsingProviders()

if (!usingProvidersResult.success) {
    location.href = '/login/index.html'
    throw ''
}

for (const provider of usingProvidersResult.value) {
    addProviderCard(provider)
}

async function getUsingProviders(): Promise<
    Result<ContentProvidersResponse[], 'not-logged-in'>
> {
    const me = await getMe()
    const usingProviders = me.expand?.using_providers

    if (!usingProviders) {
        return {
            success: false,
            error: 'not-logged-in',
        }
    }

    return {
        success: true,
        value: usingProviders,
    }
}

function addProviderCard(provider: ContentProvidersResponse) {
    const providerCard = document.createElement('div')
    providerCard.classList.add(providerListItemStyle, smallText)

    const providerName = document.createTextNode(provider.name)
    providerCard.appendChild(providerName)

    elements.providers.appendChild(providerCard)
}
