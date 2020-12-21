import { DispatchStorageMixin } from '..'
import { BaseStorage } from '../../classes'

const TEST_ITEM_1_KEY = '@testItem1Key'
const TEST_ITEM_2_KEY = '@testItem2Key'

class FakeStorage extends BaseStorage {
	static clear = jest.fn().mockImplementation(() => Promise.resolve())
	static getAllKeys = jest.fn().mockResolvedValue(['foo', 'bar'])
	static getItem = jest.fn().mockResolvedValue(42)
	static mergeItem = jest.fn().mockImplementation(() => Promise.resolve())
	static multiGet = jest.fn().mockResolvedValue([
		['foo', 0],
		['bar', 1],
	])
	static multiMerge = jest.fn().mockImplementation(() => Promise.resolve())
	static multiRemove = jest.fn().mockImplementation(() => Promise.resolve())
	static multiSet = jest.fn().mockImplementation(() => Promise.resolve())
	static removeItem = jest.fn().mockImplementation(() => Promise.resolve())
	static setItem = jest.fn().mockImplementation(() => Promise.resolve())
}

const FakeDispatchStorage = DispatchStorageMixin(FakeStorage)

describe('DispatchStorageMixin', () => {
	test('should invoke get from super', async () => {
		await FakeDispatchStorage.getItem(TEST_ITEM_1_KEY)

		expect(FakeStorage.getItem).toHaveBeenCalledTimes(1)
		expect(FakeStorage.getItem).toHaveBeenCalledWith(TEST_ITEM_1_KEY)
	})

	test('should invoke set from super', async () => {
		await FakeDispatchStorage.setItem(TEST_ITEM_1_KEY, 42)

		expect(FakeStorage.setItem).toHaveBeenCalledTimes(1)
		expect(FakeStorage.setItem).toHaveBeenCalledWith(TEST_ITEM_1_KEY, 42)
	})

	test('should invoke merge from super', async () => {
		await FakeDispatchStorage.mergeItem(TEST_ITEM_1_KEY, { foo: 'bar' })

		expect(FakeStorage.mergeItem).toHaveBeenCalledTimes(1)
		expect(FakeStorage.mergeItem).toHaveBeenCalledWith(TEST_ITEM_1_KEY, {
			foo: 'bar',
		})
	})

	test('should invoke remove from super', async () => {
		await FakeDispatchStorage.removeItem(TEST_ITEM_1_KEY)

		expect(FakeStorage.removeItem).toHaveBeenCalledTimes(1)
		expect(FakeStorage.removeItem).toHaveBeenCalledWith(TEST_ITEM_1_KEY)
	})

	test('should invoke multi get from super', async () => {
		await FakeDispatchStorage.multiGet([TEST_ITEM_1_KEY, TEST_ITEM_2_KEY])

		expect(FakeStorage.multiGet).toHaveBeenCalledTimes(1)
		expect(FakeStorage.multiGet).toHaveBeenCalledWith([
			TEST_ITEM_1_KEY,
			TEST_ITEM_2_KEY,
		])
	})

	test('should invoke multi set from super', async () => {
		await FakeDispatchStorage.multiSet([
			[TEST_ITEM_1_KEY, 'foo'],
			[TEST_ITEM_2_KEY, 'bar'],
		])

		expect(FakeStorage.multiSet).toHaveBeenCalledTimes(1)
		expect(FakeStorage.multiSet).toHaveBeenCalledWith([
			[TEST_ITEM_1_KEY, 'foo'],
			[TEST_ITEM_2_KEY, 'bar'],
		])
	})

	test('should invoke multi merge from super', async () => {
		await FakeDispatchStorage.multiMerge([
			[TEST_ITEM_1_KEY, { foo: 'bar' }],
			[TEST_ITEM_2_KEY, { baz: 'qux' }],
		])

		expect(FakeStorage.multiMerge).toHaveBeenCalledTimes(1)
		expect(FakeStorage.multiMerge).toHaveBeenCalledWith([
			[TEST_ITEM_1_KEY, { foo: 'bar' }],
			[TEST_ITEM_2_KEY, { baz: 'qux' }],
		])
	})

	test('should invoke multi remove from super', async () => {
		await FakeDispatchStorage.multiRemove([TEST_ITEM_1_KEY, TEST_ITEM_2_KEY])

		expect(FakeStorage.multiRemove).toHaveBeenCalledTimes(1)
		expect(FakeStorage.multiRemove).toHaveBeenCalledWith([
			TEST_ITEM_1_KEY,
			TEST_ITEM_2_KEY,
		])
	})

	test('should invoke clear from super', async () => {
		await FakeDispatchStorage.clear()

		expect(FakeStorage.clear).toHaveBeenCalledTimes(1)
		expect(FakeStorage.clear).toHaveBeenCalledWith()
	})

	test('should invoke get all keys from super', async () => {
		await FakeDispatchStorage.getAllKeys()

		expect(FakeStorage.getAllKeys).toHaveBeenCalledTimes(1)
		expect(FakeStorage.getAllKeys).toHaveBeenCalledWith()
	})
})
