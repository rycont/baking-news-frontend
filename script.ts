import { ClientResponseError } from 'pocketbase'
import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { isValidInterests } from './utils/isValidInterests'
import { GradualRenderer } from './gradualRenderer'
import { ArticlesResponse, NewslettersResponse } from './pocketbase-types'
import { buildLinkCard } from './linkCard'
import { API_URL } from './constants'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const interests = await getInterestsAssuredly()

renderInterests()

const date = new Date(+new Date() - 24 * 60 * 60 * 1000)

const dateDict = {
    year: date.getFullYear().toString().padStart(4, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    date: date.getDate().toString().padStart(2, '0'),
}

const today = new Date()

const todayDict = {
    year: today.getFullYear().toString().padStart(4, '0'),
    month: (today.getMonth() + 1).toString().padStart(2, '0'),
    date: today.getDate().toString().padStart(2, '0'),
}

const todayString = `${dateDict.year}-${dateDict.month}-${dateDict.date}`
const readableTodayString = `${todayDict.year}년 ${todayDict.month}월 ${todayDict.date}일, 오늘`

const articleElement = document.getElementById('article_content')!
const loadingElement = document.getElementById('loading')!
const dateElement = document.getElementById('date')!
const allArticles = document.getElementById('all_articles')!

dateElement.appendChild(document.createTextNode(readableTodayString))

try {
    const todayNewsletter = await pb.collection('newsletters').getFirstListItem<
        NewslettersResponse<{
            referring_articles: ArticlesResponse[]
        }>
    >(`date = "${todayString}"`, {
        expand: 'referring_articles',
    })

    renderNewsletterFromText(todayNewsletter)
} catch (e) {
    if (e instanceof ClientResponseError) {
        if (e.status === 404) {
            renderNewsletter()
        }
    }
}

function renderInterests() {
    const interestsElement = document.getElementById('interests')
    interestsElement?.appendChild(
        document.createTextNode(interests.map((e) => '#' + e).join(' '))
    )
}

async function renderNewsletterFromText(
    newsletter: NewslettersResponse<{
        referring_articles: ArticlesResponse[]
    }>
) {
    loadingElement.remove()

    const { content, expand } = newsletter

    assert(expand)

    for (const article of expand.referring_articles) {
        showReferringArticle(article)
    }

    const gradualRenderer = new GradualRenderer(articleElement)
    gradualRenderer.referringArticles = expand.referring_articles
    gradualRenderer.render(content)
}

const STAGE_STATUS_MAP: Record<string, string[] | string> = {
    getArticles: '소식을 들춰보고 있어요',
    getRelatedArticles: '관심 있어할 만한 소식을 살펴보고 있어요',
    createNewsletterWithArticles: '오늘의 뉴스레터를 작성하고 있어요',
}

async function renderNewsletter() {
    const source = new EventSource(
        `${API_URL}/stream_newsletter/${todayString}?authorization=${pb.authStore.token}`
    )

    const gradualRenderer = new GradualRenderer(articleElement)
    let interval: NodeJS.Timeout

    source.addEventListener('message', (e) => {
        const data = JSON.parse(e.data)

        if (data.event === 'articles') {
            const articles = data.articles as ArticlesResponse[]
            for (const article of articles) {
                showReferringArticle(article)
            }
        }

        if (data.event === 'progress') {
            const { stage } = data as { stage: string }
            if (!(stage in STAGE_STATUS_MAP)) return

            const messageElement = document.createElement('p')
            const message = STAGE_STATUS_MAP[stage]

            if (typeof message === 'string') {
                messageElement.appendChild(document.createTextNode(message))
            } else {
                let index = 0

                if (interval) {
                    clearInterval(interval)
                }

                interval = setInterval(() => {
                    messageElement.innerHTML = ''
                    messageElement.appendChild(
                        document.createTextNode(message[index])
                    )
                    index = (index + 1) % message.length
                }, 1000)
            }

            loadingElement.appendChild(messageElement)
        }

        if (data.event === 'token') {
            loadingElement.remove()
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

async function showReferringArticle(article: ArticlesResponse) {
    const linkCard = buildLinkCard(article)
    allArticles.appendChild(linkCard)
}
