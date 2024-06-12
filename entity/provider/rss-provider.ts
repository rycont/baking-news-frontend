import { Provider } from './interface'
import { clientRSSLoader } from '../rss-loader/implements/client-rss-loader'

export class RSSProvider implements Provider {
    public type = 'RSS'
    public id: string
    public url: string
    public encoding?: string

    constructor(
        source: {
            url: string
            encoding?: string
        },
        private RSSLoader = clientRSSLoader
    ) {
        this.id = source.url

        this.url = source.url
        this.encoding = source.encoding
    }

    public async getArticles() {
        const articles = await this.RSSLoader(this.url, this.encoding)

        return articles
    }

    public toJSON() {
        return {
            type: this.type,
            url: this.url,
            encoding: this.encoding,
        }
    }

    static fromJSON(json: { url: string; encoding?: string }) {
        return new RSSProvider(json)
    }
}

export interface RSSSource {
    url: string
    encoding?: string
}
