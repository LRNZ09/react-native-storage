interface UseStorageState<T> {
	getItem: () => Promise<T | null>
	mergeItem: <S extends Partial<T>>(value: S) => Promise<void>
	removeItem: () => Promise<void>
	setItem: (value: T) => Promise<void>
}

export { UseStorageState }
