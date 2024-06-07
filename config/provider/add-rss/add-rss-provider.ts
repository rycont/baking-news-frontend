import { ContentProvidersResponse } from '@/pocketbase-types'
import { Result } from '@/types/result'
import { API_URL } from '@/constants'

const ERROR_MESSAGE: Record<string, string> = {
    INVALID_URL: '유효하지 않은 URL입니다',
    PROVIDER_ALREADY_EXISTS: '이미 등록된 피드입니다',
}

async function addRSSProvider(
    url: string,
    name: string
): Promise<Result<ContentProvidersResponse, string>> {
    const responseResult = await requestAddRSSProvider(url, name)

    if (!responseResult.success) {
        return {
            success: false,
            error: '서비스 요청 중 오류가 발생했습니다',
        }
    }

    const response = responseResult.value

    const isValid = hasProviderId(response)

    if (isValid) {
        return {
            success: true,
            value: response.provider as ContentProvidersResponse,
        }
    }

    const message = hasMessage(response) && ERROR_MESSAGE[response.message]

    return {
        success: false,
        error: message || '알 수 없는 오류가 발생했습니다',
    }
}

async function requestAddRSSProvider(
    url: string,
    name: string
): Promise<Result<unknown, null>> {
    const headers = {
        'Content-Type': 'application/json',
    }

    const body = JSON.stringify({
        url,
        name,
    })

    try {
        const response = await fetch(API_URL + '/provider', {
            method: 'POST',
            headers,
            body,
        })

        const json = await response.json()

        return {
            success: true,
            value: json,
        }
    } catch (error) {
        return {
            success: false,
        }
    }
}

function hasMessage(response: any): response is {
    message: string
} {
    return 'message' in response && typeof response.message === 'string'
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

export default addRSSProvider
