import INPUT from '@shade/elements/input'
import LABEL from '@shade/elements/label'

import addRSSProvider from './add-rss-provider'
import validateRSSURL from './validate-rss-url'
import { getElements } from '@utils/getElements'
import { useRSSProvider } from './use-rss-provider'

const elements = getElements({
    button: HTMLElement,
})

export default {
    async checkValidURL(url: string) {
        const rssValidationResult = await validateRSSURL(url)

        if (!rssValidationResult.success) {
            alert('유효하지 않은 RSS URL입니다')
            return
        }

        const { title } = rssValidationResult.value
        showNameInput(title)
    },
    async register(url: string, name: string) {
        const addProviderResult = await addRSSProvider(url, name)

        if (!addProviderResult.success) {
            alert(addProviderResult.error)
            return
        }

        const newProvider = addProviderResult.value
        await useRSSProvider(newProvider.id)

        alert('새 피드를 추가했습니다')
        location.href = `/config/provider/index.html`
    },
}

function showNameInput(title?: string) {
    const label = document.createElement(LABEL)
    label.setAttribute('title', '피드 이름')

    const input = document.createElement(INPUT)
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'name')
    input.setAttribute('required', 'true')
    input.setAttribute('autofocus', 'true')

    if (title) {
        input.setAttribute('value', title)
    }

    elements.button.insertAdjacentElement('beforebegin', label)
    label.appendChild(input)
}
