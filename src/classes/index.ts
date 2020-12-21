import { DispatchStorageMixin } from '../helpers/dispatch-storage-mixin'

import { BaseStorage } from './base-storage'
import { InMemoryCacheStorage } from './in-memory-cache-storage'

const BaseDispatchStorage = DispatchStorageMixin(BaseStorage)
const InMemoryCacheDispatchStorage = DispatchStorageMixin(InMemoryCacheStorage)

export {
	BaseDispatchStorage,
	BaseStorage,
	InMemoryCacheDispatchStorage,
	InMemoryCacheStorage,
}
