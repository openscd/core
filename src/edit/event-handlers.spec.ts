import { expect, it, describe } from 'vitest';
import { handleEdit } from './event-handlers.js';
import { 
	Remove, 
	type Edit, 
	type Insert, 
	type SetAttributes, 
	type SetTextContent,
} from './edit.js';

describe('Edit API Handlers', () => {

	describe('DOM Tree Manipulation', () => {

		type TestCase = {
			desc: string,
			initialSCL: string
			createIntent: (scl:XMLDocument) => Edit,
			expectedSCL: string,
		}

		const testCases: TestCase[] = [
			{
				desc: 'Insert a new element',
				initialSCL: '<SCL></SCL>',
				createIntent: (scl) => {
					const newIED = scl.createElement('IED')
					newIED.setAttribute('name', 'newIED')
					const intent: Insert = {
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						parent: scl.querySelector('SCL')!,
						node: newIED,
						reference: null,
					}
					return intent
				},
				expectedSCL: '<SCL><IED name="newIED"/></SCL>',
			},
			{
				desc: 'Remove an element',
				initialSCL: `
					<SCL>
						<IED name="firstIED"/>
						<IED name="secondIED"/>
					</SCL>
				`,
				createIntent: (scl) => {
					const iedToRemove = scl.querySelector('IED[name="firstIED"]')!
					const intent: Edit = {
						node: iedToRemove,
						parent: undefined,
						reference: null,
					}
					return intent
				},
				expectedSCL: `
					<SCL>
						<IED name="secondIED"/>
					</SCL>
				`,
					
			},
			{
				desc: 'Set the text content of an element',
				initialSCL: `
					<SCL>
						<Communication>
							<SubNetwork name="StationBus" desc="desc" type="8-MMS">
								<BitRate unit="b/s">100.0</BitRate>
							</SubNetwork>
						</Communication>
					</SCL>
				`,
				createIntent: (scl) => {
					const ied = scl.querySelector('BitRate')!
					const intent: SetTextContent = {
						element: ied,
						textContent: '500.0',
					}
					return intent
				},
				expectedSCL: `
					<SCL>
						<Communication>
							<SubNetwork name="StationBus" desc="desc" type="8-MMS">
								<BitRate unit="b/s">500.0</BitRate>
							</SubNetwork>
						</Communication>
					</SCL>
				`,
			},
			{
				desc: 'Set the attributes of the correct element',
				initialSCL: `
					<SCL>
						<IED name="firstIED"/>
						<IED name="secondIED"/>
					</SCL>
				`,
				createIntent: (scl) => {
					const ied = scl.querySelector('IED[name="firstIED"]')!
					const intent: SetAttributes = {
						element: ied,
						attributes: {
							name: 'modifiedFirstIED',
						},
						attributesNS: {},
					}
					return intent
				},
				expectedSCL: `
					<SCL>
						<IED name="modifiedFirstIED" />
						<IED name="secondIED"/>
					</SCL>
				`,
			},
			// Note: this tes does not yet work, because the order of
			// attributes is not the same and I could not order them.
			// 
			// {
			// 	desc: 'Set the name spaced attributes of an element',
			// 	initialSCL: `
			// 		<SCL>
			// 			<IED/>
			// 		</SCL>
			// 	`,
			// 	createIntent: (scl) => {
			// 		const ied = scl.querySelector('IED')!
			// 		const intent: SetAttributes = {
			// 			element: ied,
			// 			attributes: {
			// 			},
			// 			attributesNS: {
			// 				'http://example.com/iec/61850/6789/SCL': {
			// 					prototype: 'IED_9001 intent',
			// 				},
			// 			},
			// 		}
			// 		return intent
			// 	},
			// 	expectedSCL: `
			// 		<SCL>
			// 			<IED 
			// 				xmlns:ens1="http://example.com/iec/61850/6789/SCL" 
			// 				ens1:prototype="IED_9001 expected"
			// 			/>
			// 		</SCL>
			// 	`,
			// },
		]
		
		testCases.forEach(test)

		function test(tc: TestCase) {
			it(tc.desc, () => {
				let actualSCL = createXML(tc.initialSCL)
				const intent = tc.createIntent(actualSCL)
				
				handleEdit(intent)

				actualSCL = normaliseXML(actualSCL)
				const expectedSCL = createXML(tc.expectedSCL)
				expect(toXMLString(actualSCL)).toEqual(toXMLString(expectedSCL))
			})
		}
	})
})


/**
 * The following functions help us create more readable tests.
 * They should not be used outside of tests.
 */

function normaliseXML(node: Node): XMLDocument {
	return orderAttributes(removeWhitespaceNodes(node))
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
	const newXML = new DOMParser().parseFromString(text, 'application/xml')
	const normalisedXML = normaliseXML(newXML)
	return normalisedXML
}

function toXMLString(node: Node): string {
	return new XMLSerializer().serializeToString(node)
}


function orderAttributes(doc: XMLDocument): XMLDocument {

    orderElementAttributes(doc.documentElement);
        
    return doc;
} 

function orderElementAttributes(element: Element): void {
	const attributes = Array.from(element.attributes);

	attributes.sort((a, b) => a.name.localeCompare(b.name));
	
	while (element.attributes.length > 0) {
		element.removeAttribute(element.attributes[0].name);
	}
	
	for (const attr of attributes) {
		if (attr.namespaceURI) {
			element.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
		} else {
			element.setAttribute(attr.name, attr.value);
		}
	}
	
	for (const child of Array.from(element.children)) {
		orderElementAttributes(child);
	}
}