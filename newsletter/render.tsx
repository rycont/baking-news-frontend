import { For, Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import { render } from 'solid-js/web'

import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import editIcon from '@shade/icons/Pen.svg?url'

import { popAppearProgressiveStyle } from '@shade/theme.css.ts'

import { createNewsletterFromArticles } from '@utils/api.ts'
import { assert } from '@utils/assert'
import { getMe } from '@utils/getMe'

import { ContentProvidersResponse } from '@/pocketbase-types.ts'
import { Article } from '@/article.ts'
import { pb } from '@/db'

import { getFreshArticles } from '../scripts/getFreshArticles.ts'
import { FeedbackPanel } from './widgets/feedback.tsx'

import { InterestEditor } from '@components/interest-editor/index.tsx'
import '@components/provider-editor/index.tsx'
import { getLastNewsletter } from '@/scripts/getLastNewsletter.ts'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const me = await getMe.call()

const [interests, setInterests] = createSignal(me.interests)
const [usingProviders] = createSignal(me.expand?.using_providers)

const [generationLog, setGenerationLog] = createSignal<string[]>([])
const [newsletterContent, setNewsletterContent] = createSignal<string>('')
const [referringArticles, setReferringArticles] = createSignal<Article[]>([])
const [isFeedbackPanelVisible, setFeedbackPanelVisiblity] = createSignal(false)
const [isPreviousNewsletter, setIsPreviousNewsletter] = createSignal(false)

function isInterestValid() {
    const storedInterests = interests()
    return (
        storedInterests &&
        storedInterests.filter((interest) => interest.trim().length > 0)
            .length > 0
    )
}

function isProvidersValid() {
    const storedProviders = usingProviders()
    return storedProviders && storedProviders.length > 0
}

async function refetchInterests() {
    getMe.clearCache()
    const me = await getMe.call()
    setInterests(me.interests)
}

function getTitle() {
    if (!isInterestValid()) {
        return '관심사가 등록되지 않았어요'
    }

    if (!isProvidersValid()) {
        return '어떤 출처에서 글을 받아올까요?'
    }

    return '신선한 뉴스레터를 굽고있어요'
}

const App = () => {
    return (
        <>
            <Switch
                fallback={
                    <>
                        <Spinner color="var(--bk-color-l4)" />
                        <sh-title>{getTitle()}</sh-title>
                        <Switch
                            fallback={
                                <>
                                    <sh-card>
                                        <sh-subtitle>내 관심사</sh-subtitle>
                                        <sh-horz gap={1} linebreak>
                                            <For each={interests()}>
                                                {(interest) => (
                                                    <sh-chip>
                                                        {interest}
                                                    </sh-chip>
                                                )}
                                            </For>
                                        </sh-horz>
                                    </sh-card>
                                    <sh-button attr:type="ghost">
                                        <img src={editIcon} />
                                        수정
                                    </sh-button>
                                </>
                            }
                        >
                            <Match when={!isInterestValid()}>
                                <InterestEditor />
                                <sh-button
                                    size="big"
                                    class={popAppearProgressiveStyle}
                                    onClick={refetchInterests}
                                >
                                    <img
                                        src="/shade-ui/icons/Send.svg"
                                        alt="전송 아이콘"
                                    />
                                    입력 완료
                                </sh-button>
                            </Match>
                            <Match when={!isProvidersValid()}>
                                <provider-editor />
                            </Match>
                        </Switch>
                        <sh-vert gap={2}>
                            <For each={generationLog()}>
                                {(logline) => (
                                    <sh-text
                                        L6
                                        class={popAppearProgressiveStyle}
                                    >
                                        {logline}
                                    </sh-text>
                                )}
                            </For>
                        </sh-vert>
                    </>
                }
            >
                <Match when={newsletterContent()}>
                    <Show when={isPreviousNewsletter}>
                        <info-card>
                            아직 새 소식이 충분하지 않아요. 이전 뉴스레터를
                            보여드릴게요
                        </info-card>
                    </Show>
                    <gradual-renderer
                        attr:content={newsletterContent()}
                        attr:referring-article={JSON.stringify(
                            referringArticles()
                        )}
                    />
                    <Show when={isFeedbackPanelVisible()}>
                        <FeedbackPanel />
                    </Show>
                </Match>
            </Switch>
        </>
    )
}

const renderTarget = document.getElementById('app')
assert(renderTarget, 'Cannot find renderTarget #app in this document')

render(() => <App />, renderTarget)

createEffect(() => {
    if (isInterestValid() && isProvidersValid()) {
        renderNewsletter()
    }
})

async function renderNewsletter() {
    if (!isInterestValid()) {
        return
    }

    const articles = await getArticlesFromProviders(usingProviders()!)
    setGenerationLog((prev) => [...prev, '어떤 글을 좋아할지 고민하고 있어요'])

    if (articles.length < 5) {
        setGenerationLog((prev) => [...prev, '아무것도 읽지 못했어요'])
        const lastNewsletter = getLastNewsletter()

        setReferringArticles(lastNewsletter.relatedArticles)
        setNewsletterContent(lastNewsletter.content)

        setIsPreviousNewsletter(true)
    } else {
        await createNewsletterFromArticles(articles, {
            token: (token) => {
                setNewsletterContent((prev) => prev + token)
            },
            relatedArticles: (articles) => {
                setReferringArticles(articles)
                setGenerationLog((prev) => [
                    ...prev,
                    '뉴스레터를 작성하고 있어요',
                ])
            },
        })
    }

    setFeedbackPanelVisiblity(true)
}

async function getArticlesFromProviders(providers: ContentProvidersResponse[]) {
    const articlesByProviders = new Map<string, Article[]>()

    // for (const provider of providers) {

    // }

    await Promise.all(
        providers.map(async (provider) => {
            // getFreshArticles(provider)
            //     .then((freshArticles) => {
            //         setGenerationLog((prev) => [
            //             ...prev,
            //             provider.name + ' 읽었어요',
            //         ])
            //         articlesByProviders.set(provider.id, freshArticles)
            //     })
            //     .catch(() => {
            //         setGenerationLog((prev) => [
            //             ...prev,
            //             provider.name + ' 읽는 중 오류가 발생했어요',
            //         ])
            //     })

            try {
                const freshArticles = await getFreshArticles(provider)

                setGenerationLog((prev) => [
                    ...prev,
                    provider.name + ' 읽었어요',
                ])

                articlesByProviders.set(provider.id, freshArticles)
            } catch (e) {
                setGenerationLog((prev) => [
                    ...prev,
                    provider.name + ' 읽는 중 오류가 발생했어요',
                ])
            }
        })
    )

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
