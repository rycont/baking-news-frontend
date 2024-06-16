import { User } from '@/entity/user'
import { Article } from '@/types/article'
import { createResource, createSignal } from 'solid-js'

export enum NewsletterGenerationStage {
    NOT_READY = 'NOT_READY',
    NOT_NOUGH_DATA = 'NOT_NOUGH_DATA',
    FETCHING_ARTICLES = 'FETCHING_ARTICLES',
    RENDERING = 'RENDERING',
    DONE = 'DONE',
}

export const [getMe, { refetch: refetchMe }] = createResource(User.getMe)

export const [getNewsletterContent, setNewsletterContent] =
    createSignal<string>('')

export const [getIsEnd, setIsEnd] = createSignal(false)

export const [getReferringArticle, setReferringArticle] = createSignal<
    Article[] | null
>(null)

export const [getLogs, setLogs] = createSignal<string[]>([])
export const [getIsStaleNewsletter, setIsStaleNewsletter] = createSignal(false)

export const getInterests = () => getMe()?.interests
export const getUsingProvider = () => getMe()?.usingProviders
