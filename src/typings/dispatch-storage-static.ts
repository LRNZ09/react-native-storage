import { Dispatch, SetStateAction } from 'react'

import { StorageStatic } from './storage-static'

interface DispatchStorageStatic extends StorageStatic {
	addDispatch: <T>(
		key: string,
		dispatch: Dispatch<SetStateAction<T | null | undefined>>,
	) => void
	deleteDispatch: <T>(
		key: string,
		dispatch: Dispatch<SetStateAction<T | null | undefined>>,
	) => void
}

export { DispatchStorageStatic }
