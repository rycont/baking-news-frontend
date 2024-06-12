import mockResponse from './mock-response.json'
import { RSSLoader } from '../interface'

export const mockLoader: RSSLoader = () => {
    return Promise.resolve(
        mockResponse.map((item) => ({
            ...item,
            date: new Date(item.date),
        }))
    )
}
