import Parser from 'rss-parser/dist/rss-parser.min.js'
import { extFetch } from '../extFetch'
import { ContentProvidersResponse } from '../pocketbase-types'
import { dismissUsedArticles } from '../utils/freshArticles'
import { Article } from '../article'
import { assert } from '../utils/assert'

export async function getFreshArticles(providers: ContentProvidersResponse[]) {
    const articles = []

    const maxArticlesPerProvider = Math.floor(100 / providers.length)

    for (const provider of providers) {
        try {
            const response = await extFetch(provider.url)
            const encoding = provider.encoding

            const text = encoding
                ? await decode(response, encoding)
                : await response.text()

            const parser: Parser = new Parser()
            const { items } = await parser.parseString(text)

            const articlesFromProvider = items
                .slice(0, maxArticlesPerProvider)
                .map(createArticleRecordFromItem)

            articles.push(...articlesFromProvider)
        } catch (e) {
            console.log(e)
            console.log('Failed to fetch', provider.name, provider.url)
        }
    }

    const freshArticles = dismissUsedArticles(articles)

    return freshArticles
}

async function decode(response: Response, encoding: string) {
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(await response.arrayBuffer())

    return text
}

function createArticleRecordFromItem(item: Parser.Item): Article {
    const link = item.link || item.guid
    const content = (item.summary ||
        item.content ||
        item.contentSnippet ||
        ('content:encodedSnippet' in item &&
            item['content:encodedSnippet'])) as string

    const date = item.isoDate as string

    assert(link)
    assert(item.title)

    return {
        title: item.title,
        link,
        content,
        date: new Date(date),
    }
}
