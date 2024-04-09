import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { createNewsletterFromArticles } from './utils/api'
import { GradualRenderer } from './gradualRenderer'
import { getFreshArticles } from './scripts/getFreshArticles'
import { NEWSLETTER_STORAGE_PREFIX } from './constants'
import { getLastNewsletter } from './scripts/getLastNewsletter'
import { getElements } from './utils/getElements'
import { buildLinkCard } from './linkCard'
import { Article } from './article'

const elements = getElements({
    article_content: HTMLDivElement,
    loading: HTMLDivElement,
    all_articles: HTMLDivElement,
})

const isLoggedIn = pb.authStore.isValid
if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const me = await getMe()

assert(me.expand)
const interests = me.interests
assert(interests)

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
} else {
    const newsletter = await createNewsletterFromArticles(articles, {
        token: (token) => {
            elements.loading.remove()
            renderer.render(token)
        },
        relatedArticles: (_articles) => {
            const articles = _articles.map((article) => article.data)

            renderer.referringArticles = articles
            elements.loading.remove()

            showReferringArticles(articles)
        },
    })

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
    for (const article of articles) {
        const linkCardInstance = buildLinkCard(article)
        elements.all_articles.append(linkCardInstance)
    }
}
