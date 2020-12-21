abstract class AbstractStorage {
	protected constructor() {
		throw new Error(
			'[@lrnz09/react-native-storage]: Storage is not instantiable.',
		)
	}
}

export { AbstractStorage }
