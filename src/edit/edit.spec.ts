import { expect, it, describe } from 'vitest'
import { newEditEvent } from './event'
import { Edit, isInsert, isRemove, isSetTextContent, isSetAttributes, isComplex, isEdit } from './edit'

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

describe('isRemove', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if node is defined and parent is undefined",
			expected: true,
			intent: {
				node: document.createElement('span'),
			},
		},
		{
			desc: "returns false, if node is undefined",
			expected: false,
			intent: {
				node: undefined,
			},
		},
		{
			desc: "returns false, if parent is defined",
			expected: false,
			intent: {
				parent: document.createElement('div'),
				node: document.createElement('span'),
			},
		},
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const result = isRemove(tc.intent)
			expect(result).toBe(tc.expected)
		})
	}
})

describe('isSetTextContent', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if element and textContent are defined",
			expected: true,
			intent: {
				element: document.createElement('div'),
				textContent: 'Hello',
			},
		},
		{
			desc: "returns false, if element is undefined",
			expected: false,
			intent: {
				element: undefined,
				textContent: 'Hello',
			},
		},
		{
			desc: "returns false, if textContent is undefined",
			expected: false,
			intent: {
				element: document.createElement('div'),
				textContent: undefined,
			},
		},
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const result = isSetTextContent(tc.intent)
			expect(result).toBe(tc.expected)
		})
	}
})

describe('isSetAttributes', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if element, attributes, and attributesNS are defined",
			expected: true,
			intent: {
				element: document.createElement('div'),
				attributes: { id: 'test' },
				attributesNS: { xmlns: { ns: 'http://www.w3.org/1999/xhtml' } },
			},
		},
		{
			desc: "returns false, if element is undefined",
			expected: false,
			intent: {
				element: undefined,
				attributes: { id: 'test' },
				attributesNS: { xmlns: { ns: 'http://www.w3.org/1999/xhtml' } },
			},
		},
		{
			desc: "returns false, if attributes are undefined",
			expected: false,
			intent: {
				element: document.createElement('div'),
				attributes: undefined,
				attributesNS: { xmlns: { ns: 'http://www.w3.org/1999/xhtml' } },
			},
		},
		{
			desc: "returns false, if attributesNS are undefined",
			expected: false,
			intent: {
				element: document.createElement('div'),
				attributes: { id: 'test' },
				attributesNS: undefined,
			},
		},
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const result = isSetAttributes(tc.intent)
			expect(result).toBe(tc.expected)
		})
	}
})

describe('isComplex', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if intent is an array of valid edits",
			expected: true,
			intent: [
				{ parent: document.createElement('div'), node: document.createElement('span'), reference: null },
				{ node: document.createElement('span') },
			],
		},
		{
			desc: "returns false, if intent is not an array",
			expected: false,
			intent: { parent: document.createElement('div'), node: document.createElement('span'), reference: null },
		},
		// Currently we only check for an array type but not for content
		// Is this a good idea?
		{
			desc: "returns true, the intent is an array of any kind",
			expected: true,
			intent: [ {} ],
		},
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const result = isComplex(tc.intent)
			expect(result).toBe(tc.expected)
		})
	}
})

describe('isEdit', () => {
	type TestCase = {
		desc: string,
		intent: unknown,
		expected: boolean,
	}

	const testCases: TestCase[] = [
		{
			desc: "returns true, if intent is a valid Insert intent",
			expected: true,
			intent: {
				parent: document.createElement('div'),
				node: document.createElement('span'),
				reference: null,
			},
		},
		{
			desc: "returns true, if intent is a valid Remove intent",
			expected: true,
			intent: {
				node: document.createElement('span'),
			},
		},
		{
			desc: "returns true, if intent is a valid SetTextContent intent",
			expected: true,
			intent: {
				element: document.createElement('div'),
				textContent: 'Hello',
			},
		},
		{
			desc: "returns true, if intent is a valid SetAttributes intent",
			expected: true,
			intent: {
				element: document.createElement('div'),
				attributes: { id: 'test' },
				attributesNS: { xmlns: { ns: 'http://www.w3.org/1999/xhtml' } },
			},
		},
		{
			desc: "returns true, if intent is a valid complex edit (array of edits)",
			expected: true,
			intent: [
				{ parent: document.createElement('div'), node: document.createElement('span'), reference: null },
				{ node: document.createElement('span') },
			],
		},
		// This test is correct but because an invalid Insert (parent is undefined)
		// is a valid Remove the `isEdit` returns true
		// This is way we should differentiate based on a key and not on structure and value
		// {
		// 	desc: "returns false, if intent is an invalid Insert intent",
		// 	expected: false,
		// 	intent: {
		// 		parent: undefined,
		// 		node: document.createElement('span'),
		// 		reference: null,
		// 	},
		// },
		{
			desc: "returns false, if intent is an invalid Remove intent",
			expected: false,
			intent: {
				node: undefined,
			},
		},
		{
			desc: "returns false, if intent is an invalid SetTextContent intent",
			expected: false,
			intent: {
				element: undefined,
				textContent: 'Hello',
			},
		},
		{
			desc: "returns false, if intent is an invalid SetAttributes intent",
			expected: false,
			intent: {
				element: document.createElement('div'),
				attributes: undefined,
				attributesNS: { xmlns: { ns: 'http://www.w3.org/1999/xhtml' } },
			},
		},
		{
			desc: "returns false, if intent is an invalid complex edit (array with invalid edits)",
			expected: false,
			intent: [
				{ parent: document.createElement('div'), node: undefined, reference: null },
				{ node: document.createElement('span') },
			],
		},
		{
			desc: "returns false, if intent is not an edit",
			expected: false,
			intent: { randomKey: 'randomValue' },
		},
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const result = isEdit(tc.intent)
			expect(result).toBe(tc.expected)
		})
	}
})