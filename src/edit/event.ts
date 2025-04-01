import { Edit } from './edit.js';

export type EditDetail<E extends Edit = Edit> = EditEventOptions & {
  edit: E;
};

export type EditEvent<E extends Edit = Edit> = CustomEvent<EditDetail<E>>;

type BaseEditEventOptions = {
  title?: string;
  squash?: boolean;
}

export type EditEventOptions = BaseEditEventOptions & {
  createHistoryEntry?: boolean;
};

export function newEditEvent<E extends Edit>(
  edit: E,
  options?: EditEventOptions
): EditEvent<E> {
  return new CustomEvent<EditDetail<E>>('oscd-edit-v2', {
    composed: true,
    bubbles: true,
    detail: { ...options, edit },
  });
}