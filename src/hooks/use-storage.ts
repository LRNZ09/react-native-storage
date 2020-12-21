import { useCallback, useEffect, useState } from 'react'

import { DispatchStorageStatic } from '../typings'

// https://github.com/react-native-async-storage/async-storage/issues/32

type UseStorageValueState<T> = [
	T | null | undefined,
	(data: T | null) => Promise<void>,
]

interface UseStorage<T> {
	/* <T> */ (
		DispatchStorageClass: DispatchStorageStatic,
		key: string,
		initialValue?: T | null,
	): UseStorageValueState<T>
}

const useStorage = <T>(
	DispatchStorageClass: DispatchStorageStatic,
	key: string,
	initialValue: T | null = null,
): UseStorageValueState<T> => {
	const [value, setValue] = useState<T | null>()

	const setOrRemoveStorageValue = useCallback(
		async (newValue: T | null) => {
			if (newValue === null) await DispatchStorageClass.removeItem(key)
			else await DispatchStorageClass.setItem(key, newValue)
		},
		[DispatchStorageClass, key],
	)

	const getStorageValue = useCallback(async () => {
		const storageValue = await DispatchStorageClass.getItem<T>(key)

		if (storageValue === null) {
			await DispatchStorageClass.setItem(key, initialValue)
			setValue(initialValue)
		} else {
			setValue(storageValue)
		}
	}, [DispatchStorageClass, initialValue, key])

	useEffect(() => {
		getStorageValue()

		// ! Run effect only on first mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		DispatchStorageClass.addDispatch(key, setValue)

		return () => {
			DispatchStorageClass.deleteDispatch(key, setValue)
		}
	}, [DispatchStorageClass, key])

	return [value, setOrRemoveStorageValue]
}

export { useStorage }
export type { UseStorage }
