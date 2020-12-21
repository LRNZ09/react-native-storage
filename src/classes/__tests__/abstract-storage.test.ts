import { AbstractStorage } from '../abstract-storage'

class FakeStorage extends AbstractStorage {
	static getInstance = () => new FakeStorage()
}

describe('AbstractStorage', () => {
	test('should not be instantiable', async () => {
		expect(FakeStorage.getInstance).toThrowErrorMatchingSnapshot()
	})
})
