
export function createHistoryTracker<T>(
	performEdit: (edit: T) => void,
){
	
	const history: LogEntry<T>[] = []
	let editCount = 0
	let docVersion = 0

	return {
		undo,
		redo,
		canUndo,
		canRedo,
		newHistoryEntry,
		get editCount() { return editCount },
	}

	function newHistoryEntry(undo: T, redo: T) {
		history.splice(editCount); 
		history.push({ undo, redo })
		editCount += 1
		updateVersion()
		
	}
	
	function undo(n = 1) {
		if (!canUndo() || n < 1) { return }
		
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		performEdit(history[last()!].undo)
		editCount -= 1
		updateVersion()
		if (n > 1) {
			undo(n - 1)
		}
	}
	
	/** Redo the last `n` [[Edit]]s that have been undone */
	function redo(n = 1) {
		if (!canRedo() || n < 1) { return }

		performEdit(history[editCount].redo)
		editCount += 1
		updateVersion()
		if (n > 1) {
			redo(n - 1)
		}
	}
	
	function canUndo(): boolean {
		return last() >= 0
	}
	
	function canRedo(): boolean {
		return editCount < history.length
	}

	function updateVersion(): void {
		docVersion += 1
	}

	function last(): number {
		return editCount - 1
	}
	
}

type LogEntry<T> = { undo: T, redo: T }
export type HistoryTracker<T> = ReturnType<typeof createHistoryTracker<T>>