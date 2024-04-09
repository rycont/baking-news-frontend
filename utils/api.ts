import { Article } from '../article'
import { pb } from '../db'

const API_URL = 'wss://baked-api.deno.dev/ws'

export async function createNewsletterFromArticles(
    articles: Article[],
    events: {
        token(token: string): void
        relatedArticles(
            articles: {
                data: Article
            }[]
        ): void
    }
) {
    const socket = new WebSocket(API_URL)
    await new Promise((resolve) => (socket.onopen = resolve))

    const token = pb.authStore.token

    socket.send(
        JSON.stringify({
            type: 'setAuthorization',
            data: {
                token,
            },
        })
    )

    let relatedArticles: Article[] = []

    return new Promise<{
        content: string
        relatedArticles: Article[]
    }>((resolve) => {
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
                resolve({
                    content: payload.data.content.data.content,
                    relatedArticles,
                })
            }
        })
    })
}
