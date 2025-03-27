/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type Initiator = 'user' | 'system' | 'undo' | 'redo' | string;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type Insert = {
    parent: Node;
    node: Node;
    reference: Node | null;
};
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type NamespacedAttributeValue = {
    value: string | null;
    namespaceURI: string | null;
};
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type AttributeValue = string | null | NamespacedAttributeValue;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type Update = {
    element: Element;
    attributes: Partial<Record<string, AttributeValue>>;
};
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type Remove = {
    node: Node;
};
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type Edit = Insert | Update | Remove | Edit[];
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export declare function isComplex(edit: Edit): edit is Edit[];
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export declare function isInsert(edit: Edit): edit is Insert;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export declare function isNamespaced(value: AttributeValue): value is NamespacedAttributeValue;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export declare function isUpdate(edit: Edit): edit is Update;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export declare function isRemove(edit: Edit): edit is Remove;
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export interface EditEventDetail<E extends Edit = Edit> {
    edit: E;
    initiator: Initiator;
}
/**
 * @deprecated Use the new edit event V2 API instead.
 */
export type EditEvent = CustomEvent<EditEventDetail>;

