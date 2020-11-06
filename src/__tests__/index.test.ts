import AsyncStorage from '@react-native-async-storage/async-storage'

import Storage from '..'

const BOOLEAN_ITEM_KEY = '@testBooleanItem'
const EMPTY_OBJECT_ITEM_KEY = '@testEmptyObjectItem'
const NUMBER_ITEM_KEY = '@testNumberItem'
const OBJECT_ITEM_KEY = '@testObjectItem'
const STRING_ITEM_KEY = '@testStringItem'

describe('Storage', () => {
	beforeEach(async () => {
		await Storage.multiSet<boolean | number | string | Record<string, unknown>>(
			[
				[BOOLEAN_ITEM_KEY, true],
				[EMPTY_OBJECT_ITEM_KEY, {}],
				[NUMBER_ITEM_KEY, 42],
				[OBJECT_ITEM_KEY, { foo: 'bar' }],
				[STRING_ITEM_KEY, 'teapot'],
			],
		)
	})

	afterEach(async () => {
		await Storage.clear()
	})

	test('should return null if item does not exist', async () => {
		const key = '@testNullItem'

		const value = await Storage.getItem(key)

		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(key)
		expect(value).toBeNull()
	})

	test('should return null if item has been removed', async () => {
		const oldValue = await Storage.getItem(STRING_ITEM_KEY)
		await Storage.removeItem(STRING_ITEM_KEY)
		const newValue = await Storage.getItem(STRING_ITEM_KEY)

		expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STRING_ITEM_KEY)
		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
		expect(AsyncStorage.getItem).toHaveBeenCalledWith(STRING_ITEM_KEY)
		expect(oldValue).toBe('teapot')
		expect(newValue).toBeNull()
	})

	test('should return an item from cache', async () => {
		const value = { foo: 'bar' }

		const cacheValue = await Storage.getItem(OBJECT_ITEM_KEY)

		expect(AsyncStorage.getItem).toHaveBeenCalledTimes(0)
		expect(cacheValue).toEqual(value)
	})

	test('should clear both cache and storage', async () => {
		await Storage.clear()
		const keys = await Storage.getAllKeys()

		expect(keys).toHaveLength(0)
	})
})
