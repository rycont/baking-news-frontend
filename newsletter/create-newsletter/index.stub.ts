import { Article } from '@/types/article'
import { NewsletterCreationEvents, NewsletterCreator } from './interface'
import { Newsletter } from '@/types/newsletter'
import { addUsedArticles, dismissUsedArticles } from '@utils/freshArticles'

export class NewsletterCreatorStub implements NewsletterCreator {
    static TOKEN_INTERVAL = import.meta.env.VITE_FASTMOCK ? 10 : 40
    constructor(private articles: Article[]) {}
    async create(events: NewsletterCreationEvents): Promise<Newsletter> {
        const freshArticles = dismissUsedArticles(this.articles)
        const usingArticle = freshArticles.slice(0, 5)

        events.relatedArticles(usingArticle)

        const mockContent =
            usingArticle
                .map(
                    (article) => `# ${article.title.slice(0, 3)}...라는 사실

[기사 출처](${article.link})

${article.link}라는 사실 알고 계셨나요? 꽤나 충격적이네요.`
                )
                .join('\n\n') + '오늘의 뉴스레터 어떠셨나요?     '

        let tokenQueue = [...mockContent]

        while (true) {
            const token = tokenQueue.slice(0, 5).join('')
            tokenQueue = tokenQueue.slice(5)

            await new Promise((resolve) =>
                setTimeout(resolve, NewsletterCreatorStub.TOKEN_INTERVAL)
            )

            if (!token) {
                break
            }

            events.token(token)
        }

        addUsedArticles(usingArticle.map((article) => article.link))

        return {
            content: mockContent,
            relatedArticles: usingArticle,
        }
    }
}
