import { Article } from '@/types/article'
import { NewsletterCreationEvents, NewsletterCreator } from './interface'
import { Newsletter } from '@/types/newsletter'
import { pb } from '@/db'
import { getMe } from '@utils/getMe'
import { PubSub } from '@/types/pubsub'
import { Prettify } from '@/types/prettify'

export class LLMNewsletterCreator implements NewsletterCreator {
    public pubsub = new PubSub<Prettify<NewsletterCreationEvents>>()
    private socket: WebSocket | null = null

    constructor(private articles: Article[]) {}

    create(events: NewsletterCreationEvents): Promise<Newsletter> {
        this.pubsub.sub('token', (token) => {
            events.token(token)
        })

        this.pubsub.sub('relatedArticles', (articles) => {
            events.relatedArticles(articles)
        })

        this.pubsub.sub('finished', (newsletter) => {
            events.finished(newsletter)
        })

        this.socket = new WebSocket('wss://baked-api.deno.dev/ws')

        this.socket.addEventListener('open', this.onOpen.bind(this))
        this.socket.addEventListener('message', this.onMessage.bind(this))

        return new Promise((resolve) => {
            this.pubsub.sub('finished', (newsletter) => {
                resolve(newsletter)
            })
        })
    }

    send(type: string, data: any) {
        this.socket!.send(JSON.stringify({ type, data }))
    }

    async onOpen() {
        const token = await this.getToken()
        this.send('setAuthorization', { token })
    }

    onMessage(event: MessageEvent) {
        const payload = JSON.parse(event.data)

        if (payload.type === 'authorizationSuccess') {
            this.send('setSourceArticles', {
                articles: this.articles,
            })

            return
        }

        if (payload.type === 'tokenStream') {
            this.pubsub.pub('token', [payload.data.token])

            return
        }

        if (payload.type === 'relatedArticles') {
            this.pubsub.pub('relatedArticles', [payload.data.articles])

            return
        }

        if (payload.type === 'finished') {
            this.pubsub.pub('finished', [
                {
                    content: payload.data.content,
                    relatedArticles: payload.data.articles,
                },
            ])

            return
        }
    }

    private async getToken() {
        await getMe.call()
        return pb.authStore.token
    }
}
