import { renderHook, act } from '@testing-library/react-hooks'

import { useBaseStorage, useInMemoryCacheStorage } from '..'
import { BaseStorage } from '../../classes'

const ITEM_KEY = '@testItemKey'
const NULL_ITEM_KEY = '@testNullItemKey'

describe('useBaseStorage', () => {
	beforeEach(async () => {
		await BaseStorage.setItem(ITEM_KEY, 12)
	})

	afterEach(async () => {
		await BaseStorage.clear()
	})

	test('should return null if item does not exist', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(NULL_ITEM_KEY),
		)

		await waitForValueToChange(() => result.current[0])

		expect(result.current[0]).toBeNull()
	})

	test('should return item from storage', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(ITEM_KEY),
		)

		await waitForValueToChange(() => result.current[0])

		expect(result.current[0]).toBe(12)
	})

	test('should not set default value if item exists already', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(ITEM_KEY, 34),
		)

		await waitForValueToChange(() => result.current[0])

		expect(result.current[0]).toBe(12)
	})

	test('should set default value if item does not exist', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(NULL_ITEM_KEY, 34),
		)

		await waitForValueToChange(() => result.current[0])

		expect(result.current[0]).toBe(34)
	})

	test('should not set default value on remove', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(NULL_ITEM_KEY, 56),
		)

		await waitForValueToChange(() => result.current[0])
		await act(async () => {
			await result.current[1](null)
		})

		expect(result.current[0]).toBeNull()
	})

	test('should set item to storage', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(ITEM_KEY),
		)

		await waitForValueToChange(() => result.current[0])
		await act(async () => {
			await result.current[1](0)
		})

		expect(result.current[0]).toBe(0)
	})

	test('should remove item from storage', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useBaseStorage(ITEM_KEY),
		)

		await waitForValueToChange(() => result.current[0])
		await act(async () => {
			await result.current[1](null)
		})

		expect(result.current[0]).toBeNull()
	})

	test('should work with in memory cache', async () => {
		const { result, waitForValueToChange } = renderHook(() =>
			useInMemoryCacheStorage(ITEM_KEY),
		)

		await waitForValueToChange(() => result.current[0])

		expect(result.current[0]).toBe(12)
	})
})
