import { describe, it, expect } from 'vitest';

import {
	LEGACY_ACCORDION,
	LEGACY_ITEM,
	convertLegacyAccordion,
	convertLegacyBlocks,
} from './legacy';

/**
 * Returns an existing paragraph block, as the editor holds it.
 *
 * @param {string} id Client ID and content.
 * @return {Object} Block.
 */
function paragraph( id ) {
	return {
		clientId: id,
		name: 'core/paragraph',
		attributes: { content: `Example text ${ id }` },
		innerBlocks: [],
	};
}

/**
 * Returns an Accordion Block item.
 *
 * @param {Object}   attributes  Item attributes.
 * @param {Object[]} innerBlocks Item content.
 * @return {Object} Block.
 */
function legacyItem( attributes, innerBlocks = [] ) {
	return { name: LEGACY_ITEM, attributes, innerBlocks };
}

/**
 * Returns an Accordion Block accordion.
 *
 * @param {Object}   attributes  Accordion attributes.
 * @param {Object[]} innerBlocks Items.
 * @return {Object} Block.
 */
function legacyAccordion( attributes, innerBlocks ) {
	return { name: LEGACY_ACCORDION, attributes, innerBlocks };
}

/**
 * Returns the spec of a converted item.
 *
 * @param {Object}   attributes  Item attributes.
 * @param {string}   title       Header title.
 * @param {Object[]} innerBlocks Panel content.
 * @return {Object} Block spec.
 */
function convertedItem( attributes, title, innerBlocks = [] ) {
	return {
		name: 'outstand/accordion-item',
		attributes,
		innerBlocks: [
			{
				name: 'outstand/accordion-header',
				attributes: { title },
				innerBlocks: [
					{
						name: 'outstand/accordion-icon',
						attributes: {},
						innerBlocks: [],
					},
				],
			},
			{
				name: 'outstand/accordion-panel',
				attributes: {},
				innerBlocks,
			},
		],
	};
}

describe( 'convertLegacyAccordion', () => {
	it( 'moves the item title to a header and the item content to a panel', () => {
		const content = paragraph( 'a' );
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: 'Example title' }, [ content ] ),
		] );

		expect( result ).toEqual( {
			name: 'outstand/accordion',
			attributes: {},
			innerBlocks: [ convertedItem( {}, 'Example title', [ content ] ) ],
		} );
		expect(
			result.innerBlocks[ 0 ].innerBlocks[ 1 ].innerBlocks[ 0 ]
		).toBe( content );
	} );

	it( 'drops items whose title is empty, "0", missing or not a string', () => {
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: '' }, [ paragraph( 'a' ) ] ),
			legacyItem( { title: '0' }, [ paragraph( 'b' ) ] ),
			legacyItem( {}, [ paragraph( 'c' ) ] ),
			legacyItem( { title: 5 }, [ paragraph( 'd' ) ] ),
			legacyItem( { title: 'Example title' } ),
		] );

		expect( result.innerBlocks ).toEqual( [
			convertedItem( {}, 'Example title' ),
		] );
	} );

	it( 'keeps titles that PHP does not treat as empty', () => {
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: ' ' } ),
			legacyItem( { title: '00' } ),
		] );

		expect( result.innerBlocks ).toEqual( [
			convertedItem( {}, ' ' ),
			convertedItem( {}, '00' ),
		] );
	} );

	it( 'carries over isOpen', () => {
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: 'Example title A', isOpen: true } ),
			legacyItem( { title: 'Example title B', isOpen: false } ),
		] );

		expect( result.innerBlocks ).toEqual( [
			convertedItem( { isOpen: true }, 'Example title A' ),
			convertedItem( { isOpen: false }, 'Example title B' ),
		] );
	} );

	it( 'carries over className, align and style on the accordion and the item', () => {
		const accordionAttributes = {
			className: 'example-accordion',
			align: 'wide',
			backgroundColor: 'example-color',
			style: { spacing: { padding: { top: '10px' } } },
		};
		const itemAttributes = {
			className: 'example-item',
			textColor: 'example-color',
			style: { color: { background: '#000000' } },
		};
		const result = convertLegacyAccordion( accordionAttributes, [
			legacyItem( { ...itemAttributes, title: 'Example title' } ),
		] );

		expect( result.attributes ).toEqual( accordionAttributes );
		expect( result.attributes ).not.toBe( accordionAttributes );
		expect( result.innerBlocks ).toEqual( [
			convertedItem( itemAttributes, 'Example title' ),
		] );
	} );

	it( 'converts an accordion with no items', () => {
		expect( convertLegacyAccordion( {}, [] ) ).toEqual( {
			name: 'outstand/accordion',
			attributes: {},
			innerBlocks: [],
		} );
	} );

	it( 'converts an item with no inner blocks to an empty panel', () => {
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: 'Example title' } ),
		] );

		expect( result.innerBlocks[ 0 ].innerBlocks[ 1 ] ).toEqual( {
			name: 'outstand/accordion-panel',
			attributes: {},
			innerBlocks: [],
		} );
	} );

	it( 'drops inner blocks that are not items', () => {
		const result = convertLegacyAccordion( {}, [
			paragraph( 'a' ),
			legacyItem( { title: 'Example title' } ),
			{ name: 'core/group', attributes: {}, innerBlocks: [] },
		] );

		expect( result.innerBlocks ).toEqual( [
			convertedItem( {}, 'Example title' ),
		] );
	} );

	it( 'converts an accordion nested in an item', () => {
		const result = convertLegacyAccordion( {}, [
			legacyItem( { title: 'Example outer title' }, [
				legacyAccordion( {}, [
					legacyItem( { title: 'Example inner title' } ),
				] ),
			] ),
		] );

		expect( result.innerBlocks ).toEqual( [
			convertedItem( {}, 'Example outer title', [
				{
					name: 'outstand/accordion',
					attributes: {},
					innerBlocks: [ convertedItem( {}, 'Example inner title' ) ],
				},
			] ),
		] );
	} );
} );

describe( 'convertLegacyBlocks', () => {
	it( 'converts an accordion nested in a group', () => {
		const result = convertLegacyBlocks( [
			{
				clientId: 'group',
				name: 'core/group',
				attributes: { tagName: 'section' },
				innerBlocks: [
					legacyAccordion( {}, [
						legacyItem( { title: 'Example title' } ),
					] ),
				],
			},
		] );

		expect( result ).toEqual( [
			{
				name: 'core/group',
				attributes: { tagName: 'section' },
				innerBlocks: [
					{
						name: 'outstand/accordion',
						attributes: {},
						innerBlocks: [ convertedItem( {}, 'Example title' ) ],
					},
				],
			},
		] );
	} );

	it( 'converts an accordion nested in columns', () => {
		const otherColumn = {
			clientId: 'column-b',
			name: 'core/column',
			attributes: {},
			innerBlocks: [ paragraph( 'a' ) ],
		};
		const result = convertLegacyBlocks( [
			{
				clientId: 'columns',
				name: 'core/columns',
				attributes: {},
				innerBlocks: [
					{
						clientId: 'column-a',
						name: 'core/column',
						attributes: { width: '50%' },
						innerBlocks: [
							legacyAccordion( { align: 'wide' }, [
								legacyItem( { title: 'Example title' } ),
							] ),
						],
					},
					otherColumn,
				],
			},
		] );

		const [ columns ] = result;
		const [ column, unchangedColumn ] = columns.innerBlocks;

		expect( columns.name ).toBe( 'core/columns' );
		expect( column ).toEqual( {
			name: 'core/column',
			attributes: { width: '50%' },
			innerBlocks: [
				{
					name: 'outstand/accordion',
					attributes: { align: 'wide' },
					innerBlocks: [ convertedItem( {}, 'Example title' ) ],
				},
			],
		} );
		expect( unchangedColumn ).toBe( otherColumn );
	} );

	it( 'converts two accordions in one tree', () => {
		const result = convertLegacyBlocks( [
			legacyAccordion( {}, [
				legacyItem( { title: 'Example title A' } ),
			] ),
			paragraph( 'a' ),
			{
				clientId: 'group',
				name: 'core/group',
				attributes: {},
				innerBlocks: [
					legacyAccordion( {}, [
						legacyItem( { title: 'Example title B' } ),
					] ),
				],
			},
		] );

		expect( result[ 0 ] ).toEqual( {
			name: 'outstand/accordion',
			attributes: {},
			innerBlocks: [ convertedItem( {}, 'Example title A' ) ],
		} );
		expect( result[ 1 ].clientId ).toBe( 'a' );
		expect( result[ 2 ].innerBlocks[ 0 ] ).toEqual( {
			name: 'outstand/accordion',
			attributes: {},
			innerBlocks: [ convertedItem( {}, 'Example title B' ) ],
		} );
	} );

	it( 'returns blocks without accordions as they are', () => {
		const blocks = [
			paragraph( 'a' ),
			{
				clientId: 'group',
				name: 'core/group',
				attributes: {},
				innerBlocks: [ paragraph( 'b' ) ],
			},
		];
		const result = convertLegacyBlocks( blocks );

		expect( result[ 0 ] ).toBe( blocks[ 0 ] );
		expect( result[ 1 ] ).toBe( blocks[ 1 ] );
	} );
} );
