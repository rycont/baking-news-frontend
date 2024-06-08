import { popAppearProgressiveStyle, popAppearStyle } from '@shade/theme.css'

import { ContentProvidersResponse } from '@/pocketbase-types'

import infoStyle from '@components/info-card/style.css'
import { getElements } from '@utils/getElements'
import { getMe } from '@utils/getMe'

import style from './style.css'

const elements = getElements({
    providers: HTMLDivElement,
})

const usingProviders = await getUsingProviders()

elements.providers.classList.remove('loading')
if (usingProviders.length === 0) {
    const noProviderCard = document.createElement('div')

    noProviderCard.classList.add(infoStyle.info, popAppearStyle)
    noProviderCard.appendChild(
        document.createTextNode(
            '사용중인 출처가 없어요. 출처를 등록하면 맞춤 뉴스레터를 구워줄게요.'
        )
    )

    elements.providers.appendChild(noProviderCard)
} else {
    elements.providers.classList.add(style.providerList)
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
    const providerChip = document.createElement('div')
    providerChip.classList.add(infoStyle.info, popAppearProgressiveStyle)
    providerChip.appendChild(document.createTextNode(provider.name))

    elements.providers.appendChild(providerChip)
}
