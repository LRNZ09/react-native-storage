import pick from 'lodash.pick'

import { BaseStorage } from './base-storage'

class InMemoryCacheStorage extends BaseStorage {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected static cache: Record<string, any> = {}

	static clear = async (): Promise<void> => {
		await BaseStorage.clear()

		InMemoryCacheStorage.cache = {}
	}

	static getItem = async <T>(key: string): Promise<T | null> => {
		if (key in InMemoryCacheStorage.cache)
			return InMemoryCacheStorage.cache[key] as T

		const value = await BaseStorage.getItem<T>(key)
		InMemoryCacheStorage.cache[key] = value

		return value
	}

	static mergeItem = async <T>(key: string, partialValue: T): Promise<void> => {
		await BaseStorage.mergeItem<T>(key, partialValue)

		const value = await BaseStorage.getItem<T>(key)
		InMemoryCacheStorage.cache[key] = value
	}

	static multiGet = async <T>(
		keys: string[],
	): Promise<[string, T | null][]> => {
		const cacheKeys = Object.keys(InMemoryCacheStorage.cache)
		const storageKeys = keys.filter((key) => !cacheKeys.includes(key))

		if (storageKeys.length > 0) {
			const entries = await BaseStorage.multiGet<T>(storageKeys)
			for (const [entryKey, entryValue] of entries)
				InMemoryCacheStorage.cache[entryKey] = entryValue
		}

		const cacheEntries = Object.entries(pick(InMemoryCacheStorage.cache, keys))

		return cacheEntries
	}

	static multiMerge = async <T>(
		partialEntries: [string, T][],
	): Promise<void> => {
		await BaseStorage.multiMerge<T>(partialEntries)

		const keys = partialEntries.map(([partialEntryKey]) => partialEntryKey)
		const entries = await BaseStorage.multiGet<T>(keys)

		for (const [entryKey, entryValue] of entries)
			InMemoryCacheStorage.cache[entryKey] = entryValue
	}

	static multiRemove = async (keys: string[]): Promise<void> => {
		await BaseStorage.multiRemove(keys)

		for (const key of keys) delete InMemoryCacheStorage.cache[key]
	}

	static multiSet = async <T>(entries: [string, T][]): Promise<void> => {
		await BaseStorage.multiSet<T>(entries)

		for (const [entryKey, entryValue] of entries)
			InMemoryCacheStorage.cache[entryKey] = entryValue
	}

	static removeItem = async (key: string): Promise<void> => {
		await BaseStorage.removeItem(key)

		delete InMemoryCacheStorage.cache[key]
	}

	static setItem = async <T>(key: string, value: T): Promise<void> => {
		await BaseStorage.setItem<T>(key, value)

		InMemoryCacheStorage.cache[key] = value
	}
}

export { InMemoryCacheStorage }
