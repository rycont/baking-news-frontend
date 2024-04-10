/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	ContentProviders = "content_providers",
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

export enum ContentProvidersTypeOptions {
	"rss" = "rss",
}

export enum ContentProvidersEncodingOptions {
	"EUC-KR" = "EUC-KR",
}
export type ContentProvidersRecord = {
	encoding?: ContentProvidersEncodingOptions
	fetch_content_selector?: string
	name: string
	type: ContentProvidersTypeOptions
	url: string
}

export enum UsersReadingLevelOptions {
	"E7" = "7",
	"E15" = "15",
	"E25" = "25",
}
export type UsersRecord<Tinterests = unknown> = {
	avatar?: string
	background?: string
	interests?: null | Tinterests
	name?: string
	reading_level?: UsersReadingLevelOptions
	using_providers?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type ContentProvidersResponse<Texpand = unknown> = Required<ContentProvidersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tinterests = unknown, Texpand = unknown> = Required<UsersRecord<Tinterests>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	content_providers: ContentProvidersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	content_providers: ContentProvidersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'content_providers'): RecordService<ContentProvidersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
