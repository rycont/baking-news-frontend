import { Show } from 'solid-js'
import {
    getIsStaleNewsletter,
    getNewsletterContent,
    getReferringArticle,
    getIsEnd,
} from '../storage'
import { FeedbackPanel } from './feedback'
import { popAppearStyle } from '@shade/theme.css'

function RenderNewsletter() {
    return (
        <>
            <Show when={getIsStaleNewsletter()}>
                <info-card class={popAppearStyle}>
                    아직 새 소식이 충분하지 않아요. 이전 뉴스레터를 보여드릴게요
                </info-card>
            </Show>
            <gradual-renderer
                attr:content={getNewsletterContent()}
                attr:referring-article={JSON.stringify(getReferringArticle())}
            />
            <Show when={getIsEnd() && !getIsStaleNewsletter()}>
                <FeedbackPanel />
            </Show>
        </>
    )
}

export default RenderNewsletter
