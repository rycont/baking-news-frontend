import { LLMNewsletterCreator } from '@/service/newsletter-generator/implements'
import { MockNewsletterCreator } from '@/service/newsletter-generator/implements/mock'
import { NewsletterCreationEvents } from '@/service/newsletter-generator/interface'
import { Match, Suspense, Switch, createEffect } from 'solid-js'
import {
    setLogs,
    setReferringArticle,
    setNewsletterContent,
    getNewsletterContent,
    setIsEnd,
    setIsStaleNewsletter,
} from './storage'
import { render } from 'solid-js/web'
import { assert } from '@utils/assert'
import { isPrepared } from './is-prepared'
import '@components/provider-editor'
import SlotFiller from './widgets/slot-filler'
import RenderNewsletter from './widgets/render-newsletter'
import LoadNewsletter from './widgets/load-newsletter'
import { addUsedArticles, dismissUsedArticles } from '@utils/freshArticles'
import { getRecentNewsletter, saveNewsletter } from './get-recent-newsletter'
import { Provider } from '@/entity/provider'
import { User } from '@/entity/user'
import { getArticleWithMaxAmount } from '@/service/newsletter-generator/getArticleWithMaxAmount'

function NewsletterPage(props: { prepared: ReturnType<typeof isPrepared> }) {
    return (
        <>
            <Switch>
                <Match when={props.prepared.success}>
                    <Switch fallback={<LoadNewsletter />}>
                        <Match when={getNewsletterContent()}>
                            <RenderNewsletter />
                        </Match>
                    </Switch>
                </Match>
                <Match when={!props.prepared.success && props.prepared.error}>
                    {(reason) => <SlotFiller reason={reason()} />}
                </Match>
            </Switch>
        </>
    )
}

const renderTarget = document.getElementById('app')
assert(renderTarget, 'Cannot find renderTarget #app in this document')

render(
    () => (
        <Suspense fallback={<></>}>
            <NewsletterPage prepared={isPrepared()} />
        </Suspense>
    ),
    renderTarget
)

createEffect(() => {
    if (!isPrepared().success) return

    createNewsletter({
        finished() {
            console.log('예?')
            setIsEnd(true)
        },
        relatedArticles(articles) {
            setReferringArticle(articles)
            addUsedArticles(articles.map((article) => article.link))
        },
        token(token) {
            setNewsletterContent((prev) => prev + token)
        },
    })
})

async function createNewsletter(events: NewsletterCreationEvents) {
    const newsletterCreator = import.meta.env.VITE_MOCK_NEWSLETTER_CREATION
        ? new MockNewsletterCreator()
        : new LLMNewsletterCreator()

    newsletterCreator.pubsub.sub('relatedArticles', events.relatedArticles)
    newsletterCreator.pubsub.sub('token', events.token)
    newsletterCreator.pubsub.sub('finished', events.finished)

    const freshArticles = await getArticles()

    if (freshArticles.length < 5) {
        const recentNewsletter = getRecentNewsletter()

        events.relatedArticles(recentNewsletter.relatedArticles)
        events.token(recentNewsletter.content)
        events.finished(recentNewsletter)

        setIsStaleNewsletter(true)

        return
    }

    const newsletter = await newsletterCreator.create(freshArticles)
    saveNewsletter(newsletter)
}

async function getArticles() {
    const me = await User.getMe()
    const articlesByProvider = new Map(
        await Promise.all(
            me.usingProviders.map(
                async (provider: Provider) =>
                    [
                        provider.id,
                        dismissUsedArticles(
                            await getProviderArticles(provider)
                        ),
                    ] as const
            )
        )
    )

    return [...getArticleWithMaxAmount(articlesByProvider).values()].flat()
}

async function getProviderArticles(provider: Provider) {
    try {
        const articles = await provider.getArticles()
        setLogs((prev) => [...prev, `${provider.name} 읽었어요`])

        return articles
    } catch (e) {
        setLogs((prev) => [
            ...prev,
            `${provider.name} 읽는 중 오류가 발생했어요`,
        ])
        return []
    }
}
