import { Storage } from '../classes'

import { UseStorageState } from './typings'

// https://github.com/react-native-async-storage/async-storage/issues/32

const useStorage = <T>(key: string): UseStorageState<T> => ({
	getItem: (...args) => Storage.getItem(key, ...args),
	setItem: (...args) => Storage.setItem(key, ...args),
	mergeItem: (...args) => Storage.mergeItem(key, ...args),
	removeItem: (...args) => Storage.removeItem(key, ...args),
})

export default useStorage
