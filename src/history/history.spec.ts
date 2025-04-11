import { describe, it, expect, vi } from "vitest";
import { createHistoryTracker, HistoryTracker } from "./history";

describe('History', () => {
	type TestCase = {
		desc: string
		actions:(ht: HistoryTracker<string>) => void
		expectedEditCount: number
		expectedNrOfPerformedEdits: number
	}

	const testCases: TestCase[] = [
		{
			desc: 'a new history entry',
			actions: (ht) => {
				ht.newHistoryEntry('undo-1', 'redo-1')
			},
			expectedEditCount: 1,
			expectedNrOfPerformedEdits: 0,
		},
		{
			desc: 'undo a single entry',
			actions: (ht) => {
				ht.newHistoryEntry('undo-1', 'redo-1')
				ht.undo()
			},
			expectedEditCount: 0,
			expectedNrOfPerformedEdits: 1,
		},
		{
			desc: 'redo an undo',
			actions: (ht) => {
				ht.newHistoryEntry('undo-1', 'redo-1')
				ht.undo()
				ht.redo()
			},
			expectedEditCount: 1,
			expectedNrOfPerformedEdits: 2,
		},
		{
			desc: 'create a new future',
			actions: (ht) => {
				ht.newHistoryEntry('undo-1', 'redo-1')
				ht.undo()
				ht.newHistoryEntry('undo-2', 'redo-2')
			},
			expectedEditCount: 1,
			expectedNrOfPerformedEdits: 1,
		},
		{
			desc: 'undo too many times',
			actions: (ht) => {
				ht.newHistoryEntry('undo-1', 'redo-1')
				ht.undo(5)
			},
			expectedEditCount: 0,
			expectedNrOfPerformedEdits: 1,
		}
	]

	testCases.forEach(test)

	function test(tc: TestCase) {
		it(tc.desc, () => {
			const performEdit = vi.fn()
			const ht = createHistoryTracker<string>(performEdit)
			tc.actions(ht)

			expect(ht.editCount).toBe(tc.expectedEditCount)
			expect(performEdit).toHaveBeenCalledTimes(tc.expectedNrOfPerformedEdits)
		})
	}

	

	// Additional specific test cases
	it('cannot undo when no edits exist', () => {
		const tracker = createHistoryTracker<string>(() => {})
		tracker.undo()
		expect(tracker.editCount).toBe(0)
	})

	it('cannot redo when no undone edits exist', () => {
		const tracker = createHistoryTracker<string>(() => {})
		tracker.redo()
		expect(tracker.editCount).toBe(0)
	})
})