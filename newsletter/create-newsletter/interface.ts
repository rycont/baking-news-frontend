import { Article } from '@/types/article'
import { Newsletter } from '@/types/newsletter'

export abstract class NewsletterCreator {
    constructor(_articles: Article[]) {}
    abstract create(events: NewsletterCreationEvents): Promise<Newsletter>
}

export interface NewsletterCreationEvents {
    token(token: string): void
    relatedArticles(articles: Article[]): void
    finished(newsletter: Newsletter): void
}
