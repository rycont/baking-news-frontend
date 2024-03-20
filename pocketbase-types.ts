/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Articles = "articles",
	ContentProviders = "content_providers",
	Newsletters = "newsletters",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ArticlesRecord = {
	content?: string
	content_provider?: RecordIdString
	link?: string
	title?: string
}

export enum ContentProvidersTypeOptions {
	"rss" = "rss",
}
export type ContentProvidersRecord = {
	name: string
	type: ContentProvidersTypeOptions
	url?: string
}

export type NewslettersRecord = {
	content?: string
	date?: string
	referring_articles?: RecordIdString[]
	user?: RecordIdString
}

export type UsersRecord<Tinterests = unknown> = {
	avatar?: string
	interests?: null | Tinterests
	name?: string
	using_providers?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type ArticlesResponse<Texpand = unknown> = Required<ArticlesRecord> & BaseSystemFields<Texpand>
export type ContentProvidersResponse<Texpand = unknown> = Required<ContentProvidersRecord> & BaseSystemFields<Texpand>
export type NewslettersResponse<Texpand = unknown> = Required<NewslettersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tinterests = unknown, Texpand = unknown> = Required<UsersRecord<Tinterests>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	articles: ArticlesRecord
	content_providers: ContentProvidersRecord
	newsletters: NewslettersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	articles: ArticlesResponse
	content_providers: ContentProvidersResponse
	newsletters: NewslettersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'articles'): RecordService<ArticlesResponse>
	collection(idOrName: 'content_providers'): RecordService<ContentProvidersResponse>
	collection(idOrName: 'newsletters'): RecordService<NewslettersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
