import { expect, it, describe } from 'vitest'
import { newEditEvent } from './event'
import { Edit, isInsert } from './edit'

it('newEditEvent', () => {
	const event = newEditEvent(
		{
			parent: document.createElement('div'),
			node: document.createElement('span'),
			reference: null,
		},
	)

	console.log("event", event)
})

describe('isInsert', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if parent, node and reference are not undefined",
			expected: true,
			intent: {
				parent: document.createElement('div'),
				node: document.createElement('span'),
				reference: null,
			},
		},
		{
			desc: "returns false, if parent is undefined",
			expected: false,
			intent: {
				parent: undefined,
				node: document.createElement('span'),
				reference: null,
			},
		},
		{
			desc: "returns false, if node is undefined",
			expected: false,
			intent: {
				parent: document.createElement('div'),
				node: undefined,
				reference: null,
			},
		},
		{
			desc: "returns false, if reference is undefined",
			expected: false,
			intent: {
				parent: document.createElement('div'),
				node: document.createElement('span'),
				reference: undefined,
			},
		}
	]

	testCases.forEach(test)

	function test(tc: TestCase){
		it(tc.desc, () => {
			const result = isInsert(tc.intent)	
			expect(result).toBe(tc.expected)
		})
	}

})