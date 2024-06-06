import Parser from 'rss-parser/dist/rss-parser.min.js'
import INPUT from '@shade/elements/input'
import LABEL from '@shade/elements/label'
import { getElements } from '@utils/getElements'
import { extFetch } from '@/extFetch'
import { Result } from '@/types/result'
import { API_URL } from '@/constants'
import { pb } from '@/db'
import { Collections } from '@/pocketbase-types'
import { getMe } from '@utils/getMe'

const elements = getElements({
    url_form: HTMLFormElement,
    button: HTMLElement,
})

const parser = new Parser()

elements.url_form.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()

        elements.button.setAttribute('loading', 'true')
        const { target } = e

        if (!(target instanceof HTMLFormElement)) {
            throw new Error('Form element not found')
        }

        const url = target.elements.namedItem('url')
        const name = target.elements.namedItem('name')

        const hasURL = url && url instanceof HTMLInputElement && url.value

        if (!hasURL) {
            alert('URL을 입력해주세요')
            throw new Error('URL not found')
        }

        const hasName = name && name instanceof HTMLInputElement && name.value

        if (hasName) {
            await stage.register(url.value, name.value)
        } else {
            await stage.validate(url.value)
        }
    } catch (e) {
        console.error(e)
    } finally {
        elements.button.removeAttribute('loading')
    }
})

const stage = {
    async validate(url: string) {
        const validationResult = await validateRSSURL(url)

        if (validationResult.success) {
            const { title } = validationResult.value
            showNameInput(title)
            elements.button.textContent = '저장하기'
        } else {
            alert('유효하지 않은 RSS URL입니다')
        }
    },
    async register(url: string, name: string) {
        await addRSSProvider(url, name)
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

async function validateRSSURL(url: string): Promise<
    Result<
        {
            title?: string
        },
        'invalid'
    >
> {
    try {
        const text = await (await extFetch(url)).text()
        const result = await parser.parseString(text)

        const title = result.title || result.description

        return {
            success: true,
            value: {
                title,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: 'invalid',
        }
    }
}

const ERROR_MESSAGE: Record<string, string> = {
    INVALID_URL: '유효하지 않은 URL입니다',
    PROVIDER_ALREADY_EXISTS: '이미 등록된 피드입니다',
}

async function addRSSProvider(url: string, name: string) {
    try {
        const response: unknown = await (
            await fetch(API_URL + '/provider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    name,
                }),
            })
        ).json()

        if (!hasProviderId(response)) {
            if (hasMessage(response) && response.message in ERROR_MESSAGE) {
                alert(ERROR_MESSAGE[response.message])
            } else {
                alert('알 수 없는 오류가 발생했습니다')
            }

            return
        }

        await useRSSProvider(response.provider.id)
        alert('새 피드를 추가했습니다')

        location.href = `/config/provider/index.html`
    } catch (error) {
        console.log(error)
    }
}

function hasProviderId(response: any): response is {
    provider: {
        id: string
    }
} {
    const hasProvider = 'provider' in response
    if (!hasProvider) return false

    const hasId = 'id' in response.provider
    if (!hasId) return false

    const isString = typeof response.provider.id === 'string'
    if (!isString) return false

    return true
}

function hasMessage(response: any): response is {
    message: string
} {
    return 'message' in response && typeof response.message === 'string'
}

async function useRSSProvider(providerId: string) {
    const me = await getMe()

    const newUsingProviders = [...me.using_providers, providerId]

    await pb.collection(Collections.Users).update(me.id, {
        using_providers: newUsingProviders,
    })
}
