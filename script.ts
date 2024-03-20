import { ClientResponseError } from 'pocketbase'
import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { isValidInterests } from './utils/isValidInterests'
import { GradualRenderer } from './gradualRenderer'

const API_URL = 'https://baked-api.deno.dev'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const interests = await getInterestsAssuredly()
// const providers = await getProvidersAssuredly()

renderInterests()

const today = {
    year: new Date().getFullYear().toString().padStart(4, '0'),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    date: new Date().getDate().toString().padStart(2, '0'),
}

const todayString = `${today.year}-${today.month}-${today.date}`
const articleElement = document.getElementById('article_content')!
const loadingElement = document.getElementById('loading')!

function renderInterests() {
    const interestsElement = document.getElementById('interests')
    interestsElement?.appendChild(
        document.createTextNode(interests.map((e) => '#' + e).join(' '))
    )
}

try {
    const todayNewsletter = await pb
        .collection('newsletters')
        .getFirstListItem(`date = "${todayString}"`)

    renderNewsletterFromText(todayNewsletter.content)
} catch (e) {
    if (e instanceof ClientResponseError) {
        if (e.status === 404) {
            renderNewsletter()
        }
    }
} finally {
    loadingElement.remove()
}

async function renderNewsletterFromText(content: string) {
    const gradualRenderer = new GradualRenderer(articleElement)
    gradualRenderer.render(content)
}

async function renderNewsletter() {
    const source = new EventSource(
        `${API_URL}/stream_newsletter/${todayString}?authorization=${pb.authStore.token}`
    )

    const gradualRenderer = new GradualRenderer(articleElement)

    source.addEventListener('message', (e) => {
        const data = JSON.parse(e.data)
        console.log(data)

        if (data.event === 'token') {
            gradualRenderer.render(data.token)
        }
    })
}

async function getInterestsAssuredly() {
    const me = await getMe()
    const { interests } = me

    if (!interests) {
        location.href = '/setting-required/index.html'
        throw new Error('Redirecting to setting-required')
    }

    assert(
        isValidInterests(interests, {
            checkIsEmpty: true,
        })
    )

    return interests
}

// async function getProvidersAssuredly() {
//     const me = await getMe()
//     const providers = me.using_providers

//     assert(Array.isArray(providers))
//     assert(providers.length > 0)

//     return providers
// }
