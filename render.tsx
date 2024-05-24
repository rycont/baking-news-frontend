import { render } from 'solid-js/web'
import { For, Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import { pb } from './db'
import { getMe } from './utils/getMe'
import { assert } from './utils/assert'
import Spinner from './shade-ui/dist/animated/spinner.svg?component-solid'
import editIcon from './shade-ui/dist/Pen.svg?url'
import { logTextStyle } from './style.css.ts'
import { getFreshArticles } from './scripts/getFreshArticles.ts'
import { popAppearStyle } from './shade-ui/theme.css.ts'
import { Article } from './article.ts'
import { ContentProvidersResponse } from './pocketbase-types.ts'
import { NEWSLETTER_STORAGE_PREFIX } from './constants.ts'
import { createNewsletterFromArticles } from './utils/api.ts'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const me = await getMe()

const interests = me.interests
const usingProviders = me.expand?.using_providers

if (!interests) {
    location.href = '/setup-interests/index.html'
    throw new Error('No interests')
}

if (!usingProviders || usingProviders.length === 0) {
    location.href = '/setup-providers/index.html'
    throw new Error('No providers')
}

const [generationLog, setGenerationLog] = createSignal<string[]>([])
const [newsletterContent, setNewsletterContent] = createSignal<string>('')
const [referringArticles, setReferringArticles] = createSignal<Article[]>([])

const App = () => {
    return (
        <>
            <Switch
                fallback={
                    <>
                        <Spinner color="var(--bk-color-l4)" />
                        <sh-title>신선한 뉴스레터를 굽고있어요</sh-title>
                        <sh-card>
                            <sh-subtitle>내 관심사</sh-subtitle>
                            <sh-horz gap={1} linebreak>
                                <For each={interests}>
                                    {(interest) => (
                                        <sh-chip>{interest}</sh-chip>
                                    )}
                                </For>
                            </sh-horz>
                        </sh-card>
                        <sh-button attr:type="ghost" attr:icon={editIcon}>
                            수정
                        </sh-button>
                        <sh-vert gap={2} className={logTextStyle}>
                            <For each={generationLog()}>
                                {(logline) => (
                                    <sh-text L6 class={popAppearStyle}>
                                        {logline}
                                    </sh-text>
                                )}
                            </For>
                        </sh-vert>
                    </>
                }
            >
                <Match when={newsletterContent()}>
                    <gradual-renderer
                        attr:content={newsletterContent()}
                        attr:referring-article={JSON.stringify(
                            referringArticles()
                        )}
                    />
                </Match>
            </Switch>
        </>
    )
}

const renderTarget = document.getElementById('app')
assert(renderTarget, 'Cannot find renderTarget #app in this document')

render(() => <App />, renderTarget)

const articles = await getArticlesFromProviders(usingProviders)
setGenerationLog((prev) => [...prev, '어떤 글을 좋아할지 고민하고 있어요'])

if (articles.length === 0) {
    setGenerationLog((prev) => [...prev, '아무것도 읽지 못했어요'])
    throw new Error('No articles')
}

const newsletterResult = await createNewsletterFromArticles(articles, {
    token: (token) => {
        setNewsletterContent((prev) => prev + token)
    },
    relatedArticles: (articles) => {
        setReferringArticles(articles)
        setGenerationLog((prev) => [...prev, '뉴스레터를 작성하고 있어요'])
    },
})

const now = +new Date()
localStorage.setItem(
    NEWSLETTER_STORAGE_PREFIX + now,
    JSON.stringify(newsletterResult)
)

async function getArticlesFromProviders(providers: ContentProvidersResponse[]) {
    const articlesByProviders = new Map<string, Article[]>()

    for (const provider of providers) {
        try {
            const freshArticles = await getFreshArticles(provider)
            setGenerationLog((prev) => [...prev, provider.name + ' 읽었어요'])
            articlesByProviders.set(provider.id, freshArticles)
        } catch (e) {
            setGenerationLog((prev) => [
                ...prev,
                provider.name + ' 읽는 중 오류가 발생했어요',
            ])
        }
    }

    const articleMap = getArticleWithMaxAmount(articlesByProviders)
    return [...articleMap.values()].flat()
}

function getArticleWithMaxAmount(
    articlesMap: Map<string, Article[]>,
    maxArticles = 100
) {
    while (true) {
        const articleAmount = getArticleAmounts(articlesMap)

        if (articleAmount <= maxArticles) {
            break
        }

        const maxProviders = getMaxProvider(articlesMap)

        const articles = articlesMap.get(maxProviders)

        if (!articles) {
            break
        }

        articlesMap.set(maxProviders, articles.slice(0, articles.length - 1))
    }

    return articlesMap
}

function getMaxProvider(articlesByProviders: Map<string, Article[]>) {
    let maxProviderId = ''
    let maxProviderArticleCount = 0

    for (const [providerId, articles] of articlesByProviders) {
        if (articles.length > maxProviderArticleCount) {
            maxProviderId = providerId
            maxProviderArticleCount = articles.length
        }
    }

    return maxProviderId
}

function getArticleAmounts(articlesByProviders: Map<string, Article[]>) {
    return [...articlesByProviders.values()].reduce(
        (acc, articles) => acc + articles.length,
        0
    )
}