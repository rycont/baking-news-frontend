import { getElements } from '@utils/getElements'
import { assert } from '@utils/assert'

import formActions from './form-actions'

const elements = getElements({
    url_form: HTMLFormElement,
    button: HTMLElement,
})

async function onSubmit(event: SubmitEvent) {
    event.preventDefault()

    const { url, name } = parseFormFromEvent(event)

    if (!url) {
        alert('URL을 입력해주세요')
        throw new Error('URL not found')
    }

    if (!name) {
        await formActions.checkValidURL(url)
    } else {
        await formActions.register(url, name)
    }
}

function parseFormFromEvent(event: SubmitEvent) {
    const form = event.target

    assert(form instanceof HTMLFormElement, 'Form element not found')

    const urlInput = form.elements.namedItem('url')
    const nameInput = form.elements.namedItem('name')

    const url =
        urlInput && urlInput instanceof HTMLInputElement && urlInput.value
    const name =
        nameInput && nameInput instanceof HTMLInputElement && nameInput.value

    return { url, name }
}

elements.url_form.addEventListener('submit', async (e) => {
    try {
        elements.button.setAttribute('loading', 'true')
        await onSubmit(e)
    } finally {
        elements.button.removeAttribute('loading')
    }
})
