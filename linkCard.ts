import { Article } from './article'

const linkCardTemplate = document.getElementById(
    'link_card'
) as HTMLTemplateElement

export function buildLinkCard(article: Article) {
    const linkCard = linkCardTemplate.content.cloneNode(true) as HTMLElement

    const title = linkCard.querySelector('.title') as HTMLElement
    const link = linkCard.querySelector('.link') as HTMLElement
    const anchor = linkCard.querySelector('a') as HTMLAnchorElement

    title.appendChild(document.createTextNode(article.title))
    link.appendChild(document.createTextNode(article.link))
    anchor.href = article.link

    return linkCard
}
