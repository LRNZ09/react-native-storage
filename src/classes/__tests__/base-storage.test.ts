import AsyncStorage from '@react-native-async-storage/async-storage'

import { BaseStorage } from '..'

const EMPTY_RECORD_ITEM_KEY = '@testEmptyObjectItemKey'
const NULL_ITEM_KEY = '@testNullItemKey'
const RECORD_ITEM_KEY = '@testObjectItemKey'

describe('BaseStorage', () => {
	beforeEach(async () => {
		await BaseStorage.multiSet<
			boolean | number | string | Record<string, unknown>
		>([
			[EMPTY_RECORD_ITEM_KEY, {}],
			[RECORD_ITEM_KEY, { foo: 'bar' }],
		])
	})

	afterEach(async () => {
		await BaseStorage.clear()
	})

	test('should return null if item does not exist', async () => {
		jest.spyOn(JSON, 'parse')

		const value = await BaseStorage.getItem(NULL_ITEM_KEY)

		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(NULL_ITEM_KEY)
		expect(JSON.parse).toHaveBeenCalledTimes(0)
		expect(value).toBeNull()
	})

	test('should return null if item has been removed', async () => {
		await BaseStorage.removeItem(RECORD_ITEM_KEY)
		const newValue = await BaseStorage.getItem(RECORD_ITEM_KEY)

		expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(newValue).toBeNull()
	})

	test('should return parsed item from storage', async () => {
		jest.spyOn(JSON, 'parse')

		const value = await BaseStorage.getItem(RECORD_ITEM_KEY)

		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(JSON.parse).toHaveBeenCalledTimes(1)
		expect(value).toStrictEqual({ foo: 'bar' })
	})

	test('should merge a parsed item in storage', async () => {
		await BaseStorage.mergeItem(RECORD_ITEM_KEY, { baz: 'qux' })
		const value = await BaseStorage.getItem(RECORD_ITEM_KEY)

		expect(AsyncStorage.mergeItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.mergeItem).toHaveBeenCalledWith(
			RECORD_ITEM_KEY,
			'{"baz":"qux"}',
		)
		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(value).toStrictEqual({ foo: 'bar', baz: 'qux' })
	})

	test('should return multiple parsed items from storage', async () => {
		const anotherItemKey = '@foobar'
		const yetAnotherItemKey = '@bazqux'
		await BaseStorage.setItem(anotherItemKey, 42)

		const values = await BaseStorage.multiGet([
			RECORD_ITEM_KEY,
			anotherItemKey,
			yetAnotherItemKey,
		])

		expect(AsyncStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.multiGet).toHaveBeenCalledWith([
			RECORD_ITEM_KEY,
			anotherItemKey,
			yetAnotherItemKey,
		])
		expect(values).toStrictEqual([
			[RECORD_ITEM_KEY, { foo: 'bar' }],
			[anotherItemKey, 42],
			[yetAnotherItemKey, null],
		])
	})

	test('should set multiple parsed items in storage', async () => {
		await BaseStorage.multiSet([
			[EMPTY_RECORD_ITEM_KEY, null],
			[RECORD_ITEM_KEY, {}],
		])
		const values = await BaseStorage.multiGet([
			EMPTY_RECORD_ITEM_KEY,
			RECORD_ITEM_KEY,
		])

		// * it includes the call in before each
		expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(2)
		expect(AsyncStorage.multiSet).toHaveBeenLastCalledWith([
			[EMPTY_RECORD_ITEM_KEY, 'null'],
			[RECORD_ITEM_KEY, '{}'],
		])
		expect(values).toStrictEqual([
			[EMPTY_RECORD_ITEM_KEY, null],
			[RECORD_ITEM_KEY, {}],
		])
	})

	test('should merge multiple parsed items in storage', async () => {
		await BaseStorage.multiMerge([
			[RECORD_ITEM_KEY, { baz: 1 }],
			[EMPTY_RECORD_ITEM_KEY, { qux: 2 }],
		])
		const values = await BaseStorage.multiGet([
			RECORD_ITEM_KEY,
			EMPTY_RECORD_ITEM_KEY,
		])

		expect(AsyncStorage.multiMerge).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.multiMerge).toHaveBeenCalledWith([
			[RECORD_ITEM_KEY, '{"baz":1}'],
			[EMPTY_RECORD_ITEM_KEY, '{"qux":2}'],
		])
		expect(AsyncStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.multiGet).toHaveBeenCalledWith([
			RECORD_ITEM_KEY,
			EMPTY_RECORD_ITEM_KEY,
		])
		expect(values).toStrictEqual([
			[RECORD_ITEM_KEY, { foo: 'bar', baz: 1 }],
			[EMPTY_RECORD_ITEM_KEY, { qux: 2 }],
		])
	})

	test('should remove multiple parsed items from storage', async () => {
		await BaseStorage.multiRemove([RECORD_ITEM_KEY, EMPTY_RECORD_ITEM_KEY])
		const values = await BaseStorage.multiGet([
			RECORD_ITEM_KEY,
			EMPTY_RECORD_ITEM_KEY,
		])

		expect(values).toStrictEqual([
			[RECORD_ITEM_KEY, null],
			[EMPTY_RECORD_ITEM_KEY, null],
		])
	})

	test('should clear storage', async () => {
		await BaseStorage.clear()
		const keys = await BaseStorage.getAllKeys()

		expect(AsyncStorage.clear).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1)
		expect(keys).toHaveLength(0)
	})

	test('should handle remove between merge', async () => {
		;(AsyncStorage.mergeItem as jest.Mock).mockImplementationOnce(
			async (key: string) => {
				AsyncStorage.removeItem(key)
			},
		)
		await BaseStorage.mergeItem(RECORD_ITEM_KEY, { qux: 0 })
		const value = await BaseStorage.getItem(RECORD_ITEM_KEY)

		expect(AsyncStorage.mergeItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.mergeItem).toHaveBeenCalledWith(
			RECORD_ITEM_KEY,
			'{"qux":0}',
		)
		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(RECORD_ITEM_KEY)
		expect(value).toBeNull()
	})

	test('should handle remove between multiple merge', async () => {
		;(AsyncStorage.multiMerge as jest.Mock).mockImplementationOnce(
			async ([[key]]: [string, unknown][]) => {
				AsyncStorage.removeItem(key)
			},
		)
		await BaseStorage.multiMerge([[RECORD_ITEM_KEY, { baz: 9 }]])
		const values = await BaseStorage.multiGet([RECORD_ITEM_KEY])

		expect(AsyncStorage.multiMerge).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.multiMerge).toHaveBeenCalledWith([
			[RECORD_ITEM_KEY, '{"baz":9}'],
		])
		expect(AsyncStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.multiGet).toHaveBeenCalledWith([RECORD_ITEM_KEY])
		expect(values).toStrictEqual([[RECORD_ITEM_KEY, null]])
	})
})
