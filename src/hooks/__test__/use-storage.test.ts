import { renderHook } from '@testing-library/react-hooks'

import { useStorage } from '..'
import { BaseStorage } from '../../classes'

const ITEM_KEY = '@foobar'

describe('useStorage', () => {
	beforeEach(async () => {
		await BaseStorage.setItem(ITEM_KEY, { foo: 1 })
	})

	afterEach(async () => {
		await BaseStorage.clear()
	})

	test('should return functions for a given item key', () => {
		const { result } = renderHook(() => useStorage(ITEM_KEY))

		expect(result.current).toMatchSnapshot()
	})

	test('should get item from hook function', async () => {
		const { result } = renderHook(() => useStorage(ITEM_KEY))

		expect(await result.current.getItem()).toEqual({ foo: 1 })
	})

	test('should set item from hook function', async () => {
		const { result } = renderHook(() => useStorage<{ bar: number }>(ITEM_KEY))

		expect(await result.current.setItem({ bar: 42 })).toBeUndefined()
		expect(await result.current.getItem()).toEqual({ bar: 42 })
	})

	test('should merge item from hook function', async () => {
		const { result } = renderHook(() =>
			useStorage<{ foo: number; bar: number }>(ITEM_KEY),
		)

		expect(await result.current.mergeItem({ bar: 42 })).toBeUndefined()
		expect(await result.current.getItem()).toEqual({ foo: 1, bar: 42 })
	})

	test('should remove item from hook function', async () => {
		const { result } = renderHook(() => useStorage(ITEM_KEY))

		expect(await result.current.removeItem()).toBeUndefined()
		expect(await result.current.getItem()).toBeNull()
	})
})
