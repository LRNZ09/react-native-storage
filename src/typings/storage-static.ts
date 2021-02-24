interface StorageStatic {
	clear: () => Promise<void>
	getAllKeys: () => Promise<string[]>
	getItem: <T>(key: string) => Promise<T | null>
	mergeItem: <T extends Record<string, any>>(
		key: string,
		value: T,
	) => Promise<void>
	multiGet: <T>(keys: string[]) => Promise<[string, T | null][]>
	multiMerge: <T extends Record<string, any>>(
		entries: [string, T][],
	) => Promise<void>
	multiRemove: (keys: string[]) => Promise<void>
	multiSet: <T>(entries: [string, T][]) => Promise<void>
	removeItem: (key: string) => Promise<void>
	setItem: <T>(key: string, value: T) => Promise<void>
}

export default StorageStatic
