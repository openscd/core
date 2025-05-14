import { handleEdit } from "../edit/event-handlers"
import { createHistoryTracker } from "../history/history"
import type { Edit } from "../edit/edit"

export function createAPI(){

	const historyTracker = createHistoryTracker<Edit>(handleIntent)

	return {
		handleIntent,
		undo: historyTracker.undo,
		redo: historyTracker.redo,
		canUndo: historyTracker.canUndo,
		canRedo: historyTracker.canRedo,
		get editCount(){ return historyTracker.editCount },
	}

	function handleIntent(edit: Edit) {
		const undo = handleEdit(edit)
		historyTracker.newHistoryEntry(undo, edit)
	  }
}

export type API = ReturnType<typeof createAPI>