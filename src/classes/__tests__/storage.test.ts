import { BaseStorage, Storage } from '..'

const EMPTY_RECORD_ITEM_KEY = '@testEmptyObjectItemKey'
const NOT_CACHED_ITEM_KEY = '@testNotInMemoryCacheItemKey'
const RECORD_ITEM_KEY = '@testObjectItemKey'

// eslint-disable-next-line unicorn/no-array-for-each
Object.entries(BaseStorage).forEach(([key, value]) => {
	if (typeof value === 'function')
		jest.spyOn(BaseStorage, key as keyof BaseStorage)
})

describe('Storage', () => {
	beforeEach(async () => {
		await Promise.all([
			// Only storage
			BaseStorage.setItem(NOT_CACHED_ITEM_KEY, { baz: 'qux' }),

			// Storage and memory
			Storage.multiSet<boolean | number | string | Record<string, unknown>>([
				[EMPTY_RECORD_ITEM_KEY, {}],
				[RECORD_ITEM_KEY, { foo: 'bar' }],
			]),
		])
	})

	afterEach(async () => {
		await Storage.clear()
	})

	test('should get an item from cache', async () => {
		const value = await Storage.getItem(RECORD_ITEM_KEY)

		expect(BaseStorage.getItem).toHaveBeenCalledTimes(0)
		expect(value).toStrictEqual({ foo: 'bar' })
	})

	test('should get item from storage if not in cache', async () => {
		const value = await Storage.getItem(NOT_CACHED_ITEM_KEY)

		expect(BaseStorage.getItem).toHaveBeenCalledTimes(1)
		expect(BaseStorage.getItem).toHaveBeenCalledWith(NOT_CACHED_ITEM_KEY)
		expect(value).toStrictEqual({ baz: 'qux' })
	})

	test('should set an item in cache', async () => {
		await Storage.setItem(NOT_CACHED_ITEM_KEY, 42)
		const value = await Storage.getItem(NOT_CACHED_ITEM_KEY)

		// * it includes the call in before each
		expect(BaseStorage.setItem).toHaveBeenCalledTimes(2)
		expect(BaseStorage.setItem).toHaveBeenLastCalledWith(
			NOT_CACHED_ITEM_KEY,
			42,
		)
		expect(BaseStorage.getItem).toHaveBeenCalledTimes(0)
		expect(value).toStrictEqual(42)
	})

	test('should merge an item in cache', async () => {
		await Storage.mergeItem(RECORD_ITEM_KEY, { qux: 0 })
		const value = await Storage.getItem(RECORD_ITEM_KEY)

		expect(BaseStorage.mergeItem).toHaveBeenCalledTimes(1)
		expect(BaseStorage.mergeItem).toHaveBeenCalledWith(RECORD_ITEM_KEY, {
			qux: 0,
		})
		expect(BaseStorage.getItem).toHaveBeenCalledTimes(1)
		expect(BaseStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(value).toStrictEqual({ foo: 'bar', qux: 0 })
	})

	test('should remove an item from cache', async () => {
		await Storage.removeItem(RECORD_ITEM_KEY)
		const newValue = await Storage.getItem(RECORD_ITEM_KEY)

		expect(BaseStorage.removeItem).toHaveBeenCalledTimes(1)
		expect(BaseStorage.removeItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(BaseStorage.getItem).toHaveBeenCalledTimes(1)
		expect(BaseStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(newValue).toBeNull()
	})

	test('should get multiple items from cache', async () => {
		const values = await Storage.multiGet([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])

		expect(BaseStorage.multiGet).toHaveBeenCalledTimes(0)
		expect(values).toStrictEqual([
			[EMPTY_RECORD_ITEM_KEY, {}],
			[RECORD_ITEM_KEY, { foo: 'bar' }],
		])
	})

	test('should get multiple items from storage if not in cache', async () => {
		const anotherItemKey = '@foobar'
		const yetAnotherItemKey = '@bazqux'
		await BaseStorage.setItem(anotherItemKey, 42)

		const values = await Storage.multiGet([
			NOT_CACHED_ITEM_KEY,
			anotherItemKey,
			yetAnotherItemKey,
		])

		expect(BaseStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(BaseStorage.multiGet).toHaveBeenCalledWith([
			NOT_CACHED_ITEM_KEY,
			anotherItemKey,
			yetAnotherItemKey,
		])
		expect(values).toStrictEqual([
			[NOT_CACHED_ITEM_KEY, { baz: 'qux' }],
			[anotherItemKey, 42],
			[yetAnotherItemKey, null],
		])
	})

	test('should set multiple items in cache', async () => {
		await Storage.multiSet([
			[EMPTY_RECORD_ITEM_KEY, { waldo: 'fred' }],
			[RECORD_ITEM_KEY, { baz: 'qux' }],
		])
		const values = await Storage.multiGet([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])

		// * it includes the call in before each
		expect(BaseStorage.multiSet).toHaveBeenCalledTimes(2)
		expect(BaseStorage.multiSet).toHaveBeenLastCalledWith([
			[EMPTY_RECORD_ITEM_KEY, { waldo: 'fred' }],
			[RECORD_ITEM_KEY, { baz: 'qux' }],
		])
		expect(values).toStrictEqual([
			[EMPTY_RECORD_ITEM_KEY, { waldo: 'fred' }],
			[RECORD_ITEM_KEY, { baz: 'qux' }],
		])
	})

	test('should merge multiple items in cache', async () => {
		await Storage.multiMerge([
			[EMPTY_RECORD_ITEM_KEY, { baz: 'qux' }],
			[RECORD_ITEM_KEY, { waldo: 'fred' }],
		])
		const values = await Storage.multiGet([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])

		expect(BaseStorage.multiMerge).toHaveBeenCalledTimes(1)
		expect(BaseStorage.multiMerge).toHaveBeenCalledWith([
			[EMPTY_RECORD_ITEM_KEY, { baz: 'qux' }],
			[RECORD_ITEM_KEY, { waldo: 'fred' }],
		])
		expect(BaseStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(BaseStorage.multiGet).toHaveBeenCalledWith([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])
		expect(values).toStrictEqual([
			[EMPTY_RECORD_ITEM_KEY, { baz: 'qux' }],
			[RECORD_ITEM_KEY, { foo: 'bar', waldo: 'fred' }],
		])
	})

	test('should remove multiple items from cache', async () => {
		await Storage.multiRemove([EMPTY_RECORD_ITEM_KEY, RECORD_ITEM_KEY])
		const values = await Storage.multiGet([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])

		expect(values).toStrictEqual([
			[EMPTY_RECORD_ITEM_KEY, null],
			[RECORD_ITEM_KEY, null],
		])
	})

	test('should clear both cache and storage', async () => {
		await Storage.clear()
		const keys = await Storage.getAllKeys()

		expect(BaseStorage.clear).toHaveBeenCalledTimes(1)
		expect(BaseStorage.getAllKeys).toHaveBeenCalledTimes(1)
		expect(keys).toHaveLength(0)
	})
})
