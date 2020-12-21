import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
} from 'react-native'
import { useInMemoryCacheStorage } from '@lrnz09/react-native-storage'
import { useCallback } from 'react'

const ITEM_KEY = '@testItem'
const DEFAULT_ITEM_VALUE = 'foo'

const App: React.FC = () => {
	const [testItem, setTestItem] = useInMemoryCacheStorage<string>(
		ITEM_KEY,
		DEFAULT_ITEM_VALUE,
	)

	return (
		<>
			<StatusBar style='auto' />

			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Item:</Text>
				<Text>{JSON.stringify(testItem)}</Text>

				<TextInput
					defaultValue={testItem ?? ''}
					editable={testItem !== undefined}
					onChangeText={setTestItem}
					placeholder='bar'
					style={styles.textInput}
				/>
			</ScrollView>

			<AppButton />
		</>
	)
}

const AppButton: React.FC = () => {
	const [, setTestItem] = useInMemoryCacheStorage<string>(ITEM_KEY)

	const handleOnResetPress = useCallback(async () => {
		await setTestItem(DEFAULT_ITEM_VALUE)
	}, [])

	const handleOnRemovePress = useCallback(async () => {
		await setTestItem(null)
	}, [])

	return (
		<SafeAreaView style={styles.pressableContainer}>
			<Pressable
				onPress={handleOnResetPress}
				style={[styles.pressable, styles.warningPressable]}
			>
				<Text>Reset item to default value</Text>
			</Pressable>
			<Pressable
				onPress={handleOnRemovePress}
				style={[styles.pressable, styles.dangerPressable]}
			>
				<Text>Remove item</Text>
			</Pressable>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'center',
	},
	pressableContainer: {
		flexDirection: 'row',
	},
	pressable: {
		alignItems: 'center',
		borderRadius: 8,
		backgroundColor: 'lightgray',
		padding: 8,
		margin: 16,
	},
	warningPressable: {
		backgroundColor: 'sandybrown',
	},
	dangerPressable: {
		backgroundColor: 'salmon',
	},
	textInput: {
		backgroundColor: 'lightgray',
		borderRadius: 8,
		padding: 8,
		margin: 16,
		width: 240,
	},
	title: {
		fontWeight: 'bold',
	},
})

export default App
