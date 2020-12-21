import { BaseDispatchStorage, InMemoryCacheDispatchStorage } from '../classes'

import { UseStorage, useStorage } from './use-storage'

type DropFirst<T extends [unknown, ...unknown[]]> = T extends [
	unknown,
	...infer U
]
	? U
	: never

interface UseDispatchStorage {
	<T>(...args: DropFirst<Parameters<UseStorage<T>>>): ReturnType<UseStorage<T>>
}

const useBaseStorage: UseDispatchStorage = (...args) =>
	useStorage(BaseDispatchStorage, ...args)

const useInMemoryCacheStorage: UseDispatchStorage = (...args) =>
	useStorage(InMemoryCacheDispatchStorage, ...args)

export { useBaseStorage, useInMemoryCacheStorage }
