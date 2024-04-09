import { Article } from '../article'

export function dismissUsedArticles(articles: Article[]) {
    const usedArticles = JSON.parse(
        localStorage.getItem('usedArticles') || '[]'
    )

    const newArticles = articles.filter(
        (article) => !usedArticles.includes(article.link)
    )

    const newUsedArticles = [
        ...usedArticles,
        ...articles.map((article) => article.link),
    ]

    localStorage.setItem('usedArticles', JSON.stringify(newUsedArticles))

    return newArticles
}
