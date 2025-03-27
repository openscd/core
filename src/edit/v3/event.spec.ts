import { expect, test } from 'vitest'
import { newEditEventV2 } from './event'

test('newEditEventV2', () => {
	const event = newEditEventV2(
		{
			parent: document.createElement('div'),
			node: document.createElement('span'),
			reference: null,
		},
	)

	console.log("event", event)
})