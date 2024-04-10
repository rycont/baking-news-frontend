import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { createNewsletterFromArticles } from './utils/api'
import { GradualRenderer } from './gradualRenderer'
import { NEWSLETTER_STORAGE_PREFIX, READING_LEVEL_ORDER } from './constants'
import { getLastNewsletter } from './scripts/getLastNewsletter'
import { getElements } from './utils/getElements'
import { buildLinkCard } from './linkCard'
import { Article } from './article'
import { Collections, UsersReadingLevelOptions } from './pocketbase-types'
import { getFreshArticles } from './scripts/getFreshArticles'

const elements = getElements({
    article_content: HTMLDivElement,
    loading: HTMLDivElement,
    all_articles: HTMLDivElement,
    date: HTMLParagraphElement,
    interests: HTMLParagraphElement,
    footer: HTMLDivElement,
    feedback: HTMLDivElement,
    response_message: HTMLParagraphElement,
})

const isLoggedIn = pb.authStore.isValid
if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const me = await getMe()

assert(me.expand)
const interests = me.interests
assert(interests)

renderDatePill()
renderInterests()

const providers = me.expand.using_providers.map((provider) =>
    createReadProxy(provider, providerAccessed.bind(null, provider))
)

assert(providers)

function logProgress(message: string) {
    const p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    elements.loading.appendChild(p)
}

function providerAccessed(provider: any) {
    logProgress(`${provider.name} 읽어보고 있어요`)
}

const articles = await getFreshArticles(providers)
const renderer = new GradualRenderer(elements.article_content)

if (articles.length === 0) {
    const last = getLastNewsletter()
    renderer.referringArticles = last.relatedArticles

    elements.loading.remove()
    showReferringArticles(last.relatedArticles)

    renderer.render(last.content)
    renderer.render('*****')
    showFeedback()
} else {
    logProgress(
        articles.length + '개의 기사중 어떤 소식을 좋아할지 고민하고 있어요'
    )

    const newsletter = await createNewsletterFromArticles(articles, {
        token: (token) => {
            elements.loading.remove()
            renderer.render(token)
        },
        relatedArticles: (articles) => {
            logProgress('뉴스레터를 작성하고 있어요')

            renderer.referringArticles = articles
            elements.loading.remove()

            showReferringArticles(articles)
        },
    })

    renderer.render('*****')
    showFeedback()

    const now = +new Date()
    localStorage.setItem(
        NEWSLETTER_STORAGE_PREFIX + now,
        JSON.stringify(newsletter)
    )
}

function createReadProxy<T extends object>(target: T, event: () => void) {
    let isAccessed = false

    return new Proxy(target, {
        get(target, prop) {
            if (!isAccessed) {
                isAccessed = true
                event()
            }

            return Reflect.get(target, prop)
        },
    })
}

function showReferringArticles(articles: Article[]) {
    elements.all_articles.style.setProperty('display', 'flex')

    for (const article of articles) {
        const linkCardInstance = buildLinkCard(article)
        elements.all_articles.append(linkCardInstance)
    }
}

function renderDatePill() {
    const date = new Date()
    const dateString = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    elements.date.appendChild(document.createTextNode(dateString))
}

function renderInterests() {
    assert(interests)
    assert(interests.length > 0)
    elements.interests.appendChild(
        document.createTextNode(
            interests.map((interest) => '#' + interest).join(' ')
        )
    )
}

function showFeedback() {
    elements.footer.style.setProperty('display', 'block')
    const options = elements.feedback.querySelectorAll('input[type="radio"]')

    for (const option of options) {
        assert(option instanceof HTMLInputElement)
        option.addEventListener('click', () => {
            respondToFeedback(option.id)
        })
    }
}

function respondToFeedback(feedback: string) {
    if (feedback === 'proper') {
        elements.response_message.textContent = '좋게 읽어주셔서 감사합니다'
    } else if (feedback === 'easy') {
        elements.response_message.textContent =
            '참고해서 다음엔 더 적절하게 작성해볼게요'

        moveReadingLevel(1)
    } else if (feedback === 'hard') {
        elements.response_message.textContent = '더 쉽게 쓰도록 노력할게요'

        moveReadingLevel(-1)
    }
}

async function moveReadingLevel(delta: number) {
    const currentReadingLevel = me.reading_level || UsersReadingLevelOptions.E15

    const currentIndex = READING_LEVEL_ORDER.indexOf(currentReadingLevel)

    const nextIndex = currentIndex + delta
    if (nextIndex < 0 || nextIndex >= READING_LEVEL_ORDER.length) {
        return
    }

    const nextReadingLevel = READING_LEVEL_ORDER[nextIndex]

    await pb.collection(Collections.Users).update(me.id, {
        reading_level: nextReadingLevel,
    })
}
