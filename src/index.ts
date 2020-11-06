import AsyncStorage from '@react-native-async-storage/async-storage'
import pick from 'lodash.pick'
import xor from 'lodash.xor'

class Storage {
	private static cache: Record<string, unknown> = {}

	static getItem = async <T>(key: string): Promise<T | null> => {
		if (Storage.cache[key] !== undefined) return Storage.cache[key] as T

		const data = await AsyncStorage.getItem(key)
		if (data === null) return null
		return JSON.parse(data)
	}

	static setItem = async <T>(key: string, data: T): Promise<void> => {
		await AsyncStorage.setItem(key, JSON.stringify(data))

		Storage.cache[key] = data
	}

	static mergeItem = async <T>(key: string, data: T): Promise<void> => {
		await AsyncStorage.mergeItem(key, JSON.stringify(data))

		const mergedData = await AsyncStorage.getItem(key)
		Storage.cache[key] = mergedData === null ? null : JSON.parse(mergedData)
	}

	static removeItem = async (key: string): Promise<void> => {
		await AsyncStorage.removeItem(key)

		delete Storage.cache[key]
	}

	static getAllKeys = (): Promise<string[]> => AsyncStorage.getAllKeys()

	static multiGet = async <T>(
		keys: string[],
	): Promise<[string, T | null][]> => {
		const cacheKeys = Object.keys(Storage.cache)
		const storageKeys = xor(keys, cacheKeys)
		const storageEntries = await AsyncStorage.multiGet(storageKeys)

		for (const [storageEntryKey, storageEntryValue] of storageEntries) {
			Storage.cache[storageEntryKey] =
				storageEntryValue === null ? null : JSON.parse(storageEntryValue)
		}

		const cacheEntries = Object.entries(
			pick(Storage.cache as Record<string, T | null>, keys),
		)

		return cacheEntries
	}

	static multiSet = async <T>(entries: [string, T][]): Promise<void> => {
		const storageEntries = entries.map(([entryKey, entryValue]) => [
			entryKey,
			JSON.stringify(entryValue),
		])
		await AsyncStorage.multiSet(storageEntries)

		for (const [storageEntryKey, storageEntryValue] of entries)
			Storage.cache[storageEntryKey] =
				storageEntryValue === null ? null : storageEntryValue
	}

	static multiMerge = async <T>(entries: [string, T][]): Promise<void> => {
		const storageEntries = entries.map(([entryKey, entryValue]) => [
			entryKey,
			JSON.stringify(entryValue),
		])
		await AsyncStorage.multiMerge(storageEntries)

		const keys = entries.map(([entryKey]) => entryKey)
		const mergedEntries = await AsyncStorage.multiGet(keys)

		for (const [entryKey, entryValue] of mergedEntries)
			Storage.cache[entryKey] =
				entryValue === null ? null : JSON.parse(entryValue)
	}

	static multiRemove = async (keys: string[]): Promise<void> => {
		await AsyncStorage.multiRemove(keys)

		for (const key of keys) delete Storage.cache[key]
	}

	static clear = async (): Promise<void> => {
		await AsyncStorage.clear()

		Storage.cache = {}
	}
}

export default Storage
