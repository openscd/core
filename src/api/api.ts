import { handleEdit as _handleEdit } from "../edit/event-handlers"
import { createHistoryTracker } from "../history/history"
import { Edit } from "../edit/edit"

export function createApi(){

	const historyTracker = createHistoryTracker<Edit>(handleEdit)

	return {
		handleEdit,
		undo: historyTracker.undo,
		redo: historyTracker.redo,
		canUndo: historyTracker.canUndo,
		canRedo: historyTracker.canRedo,
		editCount: historyTracker.editCount,
	}

	function handleEdit(edit: Edit) {
		const undo = _handleEdit(edit)
		historyTracker.newHistoryEntry(undo, edit)
	  }
}