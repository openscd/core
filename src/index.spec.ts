import { expect, test } from 'vitest'
import { foo } from './index'

test('foo always returns 1', () => {
	const result = foo()

	expect(result).toBe(1)
})