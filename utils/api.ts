import { NEWSLETTER_STORAGE_PREFIX } from '@/constants'
import { Article } from '../article'
import { pb } from '../db'
import { addUsedArticles, dismissUsedArticles } from './freshArticles'

const API_URL = 'wss://baked-api.deno.dev/ws'

export interface NewsletterCreationEvents {
    token(token: string): void
    relatedArticles(articles: Article[]): void
}

export async function createNewsletterFromArticles(
    articles: Article[],
    events: NewsletterCreationEvents
) {
    const mock = import.meta.env.VITE_MOCK_NEWSLETTER_CREATION
    if (mock) {
        console.log('Using mock newsletter creation')
        return createMockNewsletterFromArticles(articles, events)
    }

    const token = pb.authStore.token

    let relatedArticles: Article[] = []

    return new Promise<{
        content: string
        relatedArticles: Article[]
    }>((resolve) => {
        const socket = new WebSocket(API_URL)

        socket.addEventListener('open', () => {
            socket.send(
                JSON.stringify({
                    type: 'setAuthorization',
                    data: {
                        token,
                    },
                })
            )
        })

        socket.addEventListener('message', (event) => {
            const payload = JSON.parse(event.data)

            if (payload.type === 'authorizationSuccess') {
                socket.send(
                    JSON.stringify({
                        type: 'setSourceArticles',
                        data: {
                            articles: articles,
                        },
                    })
                )
            }

            if (payload.type === 'tokenStream') {
                events.token(payload.data.token)
            }

            if (payload.type === 'relatedArticles') {
                events.relatedArticles(payload.data.articles)
                relatedArticles = payload.data.articles
            }

            if (payload.type === 'finished') {
                addUsedArticles(articles.map((article) => article.link))

                const result = {
                    content: payload.data.content,
                    relatedArticles,
                }

                const now = +new Date()
                localStorage.setItem(
                    NEWSLETTER_STORAGE_PREFIX + now,
                    JSON.stringify(result)
                )

                resolve(result)
            }
        })
    })
}

async function createMockNewsletterFromArticles(
    articles: Article[],
    events: NewsletterCreationEvents
) {
    const usingArticle = dismissUsedArticles(articles).slice(0, 5)
    console.log(usingArticle)

    if (import.meta.env.VITE_FASTMOCK) {
        await new Promise((resolve) => setTimeout(resolve, 100))
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    events.relatedArticles(usingArticle)

    const mockContent =
        usingArticle
            .map(
                (article) => `# ${article.title.slice(0, 3)}...라는 사실

[기사 출처](${article.link})

${article.link}라는 사실 알고 계셨나요? 꽤나 충격적이네요.`
            )
            .join('\n\n') + '오늘의 뉴스레터 어떠셨나요?     '

    let tokenQueue = [...mockContent]

    const tokenInterval = import.meta.env.VITE_FASTMOCK ? 10 : 40

    while (true) {
        const token = tokenQueue.slice(0, 5).join('')
        tokenQueue = tokenQueue.slice(5)

        await new Promise((resolve) => setTimeout(resolve, tokenInterval))

        if (!token) {
            break
        }

        events.token(token)
    }

    addUsedArticles(usingArticle.map((article) => article.link))

    return {
        content: mockContent,
        relatedArticles: usingArticle,
    }
}
