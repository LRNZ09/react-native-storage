import { Dispatch, SetStateAction } from 'react'

import { BaseStorage } from '../classes/base-storage'
import { DispatchStorageStatic } from '../typings'

const dispatchRecord = new Proxy<
	Record<
		string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Set<Dispatch<SetStateAction<any>>>
	>
>(
	{},
	{
		get: (target, key: string) => {
			if (!(key in target)) target[key] = new Set()
			return target[key]
		},
	},
)

const invokeDispatch = <T>(key: string, value: T | null) => {
	for (const dispatch of dispatchRecord[key]) dispatch(value)
}

const DispatchStorageMixin = (
	StorageClass: typeof BaseStorage,
): DispatchStorageStatic =>
	class extends StorageClass {
		static addDispatch = <T>(
			key: string,
			dispatch: Dispatch<SetStateAction<T>>,
		): void => {
			dispatchRecord[key].add(dispatch)
		}

		static deleteDispatch = <T>(
			key: string,
			dispatch: Dispatch<SetStateAction<T>>,
		) => {
			dispatchRecord[key].delete(dispatch)
		}

		static clear = async (): Promise<void> => {
			await StorageClass.clear()

			for (const key in dispatchRecord) invokeDispatch(key, null)
		}

		static setItem = async <T>(key: string, value: T): Promise<void> => {
			await StorageClass.setItem<T>(key, value)

			invokeDispatch<T>(key, value)
		}

		static mergeItem = async <T>(
			key: string,
			partialValue: T,
		): Promise<void> => {
			await StorageClass.mergeItem<T>(key, partialValue)

			const value = await StorageClass.getItem<T>(key)

			invokeDispatch<T>(key, value)
		}

		static removeItem = async (key: string): Promise<void> => {
			await StorageClass.removeItem(key)

			invokeDispatch(key, null)
		}

		static multiSet = async <T>(entries: [string, T][]): Promise<void> => {
			await StorageClass.multiSet<T>(entries)

			for (const [entryKey, entryValue] of entries)
				invokeDispatch<T>(entryKey, entryValue)
		}

		static multiMerge = async <T>(
			partialEntries: [string, T][],
		): Promise<void> => {
			await StorageClass.multiMerge<T>(partialEntries)

			const keys = partialEntries.map(([partialEntryKey]) => partialEntryKey)
			const entries = await StorageClass.multiGet<T>(keys)

			for (const [entryKey, entryValue] of entries)
				invokeDispatch<T>(entryKey, entryValue)
		}

		static multiRemove = async (keys: string[]): Promise<void> => {
			await StorageClass.multiRemove(keys)

			for (const key of keys) invokeDispatch(key, null)
		}
	}

export { DispatchStorageMixin }
