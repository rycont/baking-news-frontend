import { Capacitor } from '@capacitor/core'
import Parser from 'rss-parser/dist/rss-parser.min.js'

import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { cfetch } from './utils/cfetch'

const isLoggedIn = pb.authStore.isValid
if (!isLoggedIn) {
    location.href = '/login'
}

const me = await getMe()

assert(me.expand)

const providers = me.expand?.using_providers

const extFetch = Capacitor.getPlatform() === 'web' ? cfetch : fetch

for (const provider of providers) {
    const response = await extFetch(provider.url)
    const encoding = provider.encoding

    const text = encoding
        ? await decode(response, encoding)
        : await response.text()

    const parser: Parser = new Parser()
    const { items } = await parser.parseString(text)

    const articles = items.map(createArticleRecordFromItem)

    await new Promise((resolve) => setTimeout(resolve, 10000))
}

async function decode(response: Response, encoding: string) {
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(await response.arrayBuffer())

    return text
}

function createArticleRecordFromItem(item: Parser.Item) {
    const link = item.link || item.guid
    const content =
        item.summary ||
        item.content ||
        item.contentSnippet ||
        item['content:encodedSnippet']

    return {
        title: item.title,
        link,
        content,
    }
}
