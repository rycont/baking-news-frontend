import { Article } from '../article'
import { pb } from '../db'

const API_URL = 'wss://baked-api.deno.dev/ws'

export async function createNewsletterFromArticles(
    articles: Article[],
    onToken: (token: string) => void
) {
    dismissUsedArticles(articles)

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

    socket.addEventListener('message', (event) => {
        const payload = JSON.parse(event.data)

        if (payload.type === 'authorizationSuccess') {
            socket.send(
                JSON.stringify({
                    type: 'setSourceArticles',
                    data: {
                        articles,
                    },
                })
            )
        }

        if (payload.type === 'tokenStream') {
            onToken(payload.data.token)
        }
    })
}

function dismissUsedArticles(articles: Article[]) {
    const usedArticles = JSON.parse(
        localStorage.getItem('usedArticles') || '[]'
    )

    const newArticles = articles.filter(
        (article) => !usedArticles.includes(article.link)
    )

    const newUsedArticles = [
        ...usedArticles,
        ...articles.map((article) => article.link),
    ]

    localStorage.setItem('usedArticles', JSON.stringify(newUsedArticles))

    return newArticles
}
