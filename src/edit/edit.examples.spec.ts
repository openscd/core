/**
 * This file contains examples of how to use the Edit API
 * 
 * We use test to be sure that our examples are always correct.
 * They are not meant for development nor for quality assurance, 
 * but for documentation. The important parts are in the "ACT" sections.
 */
import { describe, it, expect } from 'vitest';
import type { Edit, SetAttributes } from './edit';
import { handleEdit } from './event-handlers';

describe('Edit API Examples', () => {
	/**
	 * This example shows how to create a new element in the SCL
	 */
	it('Create an IED', () => {

		// Arrange
		const scl = createXML('<SCL></SCL>')

		// ACT
		const newIED = scl.createElement('IED')
		const insertNewIED: Edit = {
			parent: scl.querySelector('SCL')!,
			node: newIED,
			reference: null,
		};

		const undo = handleEdit(insertNewIED);

		// ASSERT
		expect(undo).toEqual({
			node: newIED
		})

		const expectedSCL = createXML('<SCL><IED/></SCL>')
		expect(scl).toStrictEqual(expectedSCL);

	});

	/**
	 * This example shows how to remove an element from the SCL
	 */
	it('Remove an IED', () => {
		// ARRANGE
		const actualSCL = createXML(`
			<SCL>
				<IED name="firstIED"/>
				<IED name="secondIED"/>
			</SCL>
		`)

		// ACT
		const iedToRemove = actualSCL.querySelector('IED[name="firstIED"]')!
		const removeIED: Edit = {
			node: iedToRemove!,
			parent: undefined,
			reference: null,
		};

		const undo = handleEdit(removeIED); // TODO: check this too(?)

		// ASSERT
		const expectedSCL = createXML(`
			<SCL>
				<IED name="secondIED"/>
			</SCL>
		`)

		expect(actualSCL).toStrictEqual((expectedSCL))
	})

	/**
	 * This exampel shows how to change attributes of an existing element
	 * Currently, `attributeNS` needs to be set even if do not want to change it
	 */
	it('Change the name of an IED', () => {
		// ARRANGE
		const actualSCL = createXML(`
			<SCL>
				<IED name="firstIED"/>
			</SCL>
		`)

		// ACT
		const iedToModify = actualSCL.querySelector('IED[name="firstIED"]')!
		const setAttributes: SetAttributes = {
			element: iedToModify,
			attributes: {
				name: 'modifiedIED',
				desc: 'Modified IED Description'
			},
			attributesNS: {} 
		};

		handleEdit(setAttributes);

		// ASSERT
		const expectedSCL = createXML(`
			<SCL>
				<IED name="modifiedIED" desc="Modified IED Description"/>
			</SCL>
		`)

		expect(actualSCL).toStrictEqual(expectedSCL);
	});
});


/**
 * The following functions help us create more readable tests.
 * They should not be used outside of these examples
 */

function normaliseXML(node: Node): XMLDocument {
	return removeWhitespaceNodes(node)
}

function removeWhitespaceNodes(node: Node): XMLDocument {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE && !/\S/.test(child.nodeValue || '')) {
        node.removeChild(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        removeWhitespaceNodes(child);
      }
    }

	return node as XMLDocument
}

function createXML(text: string): XMLDocument {
	const newXML =new DOMParser().parseFromString(text, 'application/xml')
	const normalisedXML = normaliseXML(newXML)
	return normalisedXML
}
