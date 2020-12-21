# @lrnz09/react-native-storage

Wrapper for AsyncStorage with memory cache

## Installation

```sh
npm install @lrnz09/react-native-storage
```

or

```sh
yarn add @lrnz09/react-native-storage
```

## Usage

```ts
import { Storage } from '@lrnz09/react-native-storage'

// ...

const item = await Storage.getItem<number>('foobar')
```
or
```ts
import { useStorage } from '@lrnz09/react-native-storage'

// ...

const [item, setItem] = useStorage<number>('foobar')
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
