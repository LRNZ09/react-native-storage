import AsyncStorage from '@react-native-async-storage/async-storage'

import {
	parseValue,
	stringifyValue,
	parseEntries,
	stringifyEntries,
} from '../utils'

import { AbstractStorage } from './abstract-storage'

// https://github.com/microsoft/TypeScript/issues/33892

class BaseStorage extends AbstractStorage /* implements StorageStatic */ {
	static clear = (): Promise<void> => AsyncStorage.clear()

	static getAllKeys = (): Promise<string[]> => AsyncStorage.getAllKeys()

	static getItem = async <T>(key: string): Promise<T | null> => {
		const rawValue = await AsyncStorage.getItem(key)
		const value = parseValue<T>(rawValue)

		return value
	}

	static mergeItem = async <T extends Record<string, any>>(
		key: string,
		value: T,
	): Promise<void> => {
		const rawValue = stringifyValue<T>(value)
		await AsyncStorage.mergeItem(key, rawValue)
	}

	static multiGet = async <T>(
		keys: string[],
	): Promise<[string, T | null][]> => {
		const rawEntries = await AsyncStorage.multiGet(keys)
		const entries = parseEntries<T>(rawEntries)

		return entries
	}

	static multiMerge = async <T extends Record<string, any>>(
		entries: [string, T][],
	): Promise<void> => {
		const rawEntries = stringifyEntries<T>(entries)
		await AsyncStorage.multiMerge(rawEntries)
	}

	static multiRemove = (keys: string[]): Promise<void> =>
		AsyncStorage.multiRemove(keys)

	static multiSet = async <T>(entries: [string, T][]): Promise<void> => {
		const rawEntries = stringifyEntries<T>(entries)
		await AsyncStorage.multiSet(rawEntries)
	}

	static removeItem = (key: string): Promise<void> =>
		AsyncStorage.removeItem(key)

	static setItem = <T>(key: string, value: T): Promise<void> =>
		AsyncStorage.setItem(key, stringifyValue<T>(value))
}

export { BaseStorage }
