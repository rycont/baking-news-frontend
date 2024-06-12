import { Article } from '@/types/article'

export abstract class Provider {
    public abstract type: string
    public abstract id: string
    constructor() {}
    public abstract getArticles(): Promise<Article[]>
}
