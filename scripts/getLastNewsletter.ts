import { NEWSLETTER_STORAGE_PREFIX } from '../constants'
import type { createNewsletterFromArticles } from '../newsletter/actions/generateNewsletterContent'

export function getLastNewsletter() {
    const keys = [...Array(localStorage.length)].map(
        (_, i) => localStorage.key(i)!
    )
    const newsletterKeys = keys
        .filter((key) => key.startsWith(NEWSLETTER_STORAGE_PREFIX))
        .sort()

    if (newsletterKeys.length === 0) {
        alert('이번엔 흥미로운 기사가 없어요. 다음에 다시 와주세요!')
        throw new Error('No newsletter found')
    }

    const lastNewsletterKey = newsletterKeys.slice(-1)[0]
    const lastNewsletter = JSON.parse(
        localStorage.getItem(lastNewsletterKey)!
    ) as Awaited<ReturnType<typeof createNewsletterFromArticles>>

    return lastNewsletter
}
