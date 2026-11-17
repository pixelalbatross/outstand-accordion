/**
 * Converts Accordion Block (`pixelalbatross/accordion`) blocks to Outstand Accordion blocks.
 *
 * An Accordion Block accordion holds `pixelalbatross/accordion-item` blocks. Each item
 * has a `title` attribute, an `isOpen` attribute and its content as inner blocks.
 *
 * `LegacyConverter` in PHP converts the same input to the same block tree for the
 * WP-CLI command and the front end.
 */
import { ACCORDION, HEADER, ICON, ITEM, PANEL } from './constants';

export const LEGACY_ACCORDION = 'pixelalbatross/accordion';
export const LEGACY_ITEM = 'pixelalbatross/accordion-item';

/**
 * Returns a copy of the attributes without some keys.
 *
 * @param {Object}   attributes Attributes.
 * @param {string[]} keys       Keys to leave out.
 * @return {Object} Attributes.
 */
function omit( attributes, keys ) {
	return Object.fromEntries(
		Object.entries( attributes ?? {} ).filter(
			( [ key ] ) => ! keys.includes( key )
		)
	);
}

/**
 * Builds a block spec.
 *
 * @param {string}   name        Block name.
 * @param {Object}   attributes  Block attributes.
 * @param {Object[]} innerBlocks Inner block specs or existing blocks.
 * @return {Object} Block spec.
 */
function spec( name, attributes = {}, innerBlocks = [] ) {
	return { name, attributes, innerBlocks };
}

/**
 * Whether Accordion Block displays an item with this title.
 *
 * Accordion Block skips an item when PHP's `empty()` is true for its title, so an
 * empty string and "0" hide the item. Titles that are not strings are treated as
 * hidden too.
 *
 * @param {unknown} title Item title.
 * @return {boolean} Whether the item is displayed.
 */
function isDisplayedTitle( title ) {
	return typeof title === 'string' && title !== '' && title !== '0';
}

/**
 * Converts the Accordion Block accordions in a list of blocks, at any depth.
 *
 * Other blocks keep their attributes; only their inner blocks are checked.
 *
 * @param {Object[]} blocks Blocks.
 * @return {Object[]} Blocks and specs.
 */
export function convertLegacyBlocks( blocks ) {
	return blocks.map( ( block ) => {
		if ( block.name === LEGACY_ACCORDION ) {
			return convertLegacyAccordion(
				block.attributes,
				block.innerBlocks
			);
		}

		if ( ! block.innerBlocks?.length ) {
			return block;
		}

		const innerBlocks = convertLegacyBlocks( block.innerBlocks );
		const hasChanged = innerBlocks.some(
			( innerBlock, index ) => innerBlock !== block.innerBlocks[ index ]
		);

		return hasChanged
			? spec( block.name, block.attributes, innerBlocks )
			: block;
	} );
}

/**
 * Converts one Accordion Block item.
 *
 * The title moves to a header with an icon that inherits the accordion icon, and the content moves to a
 * panel. The item keeps its other attributes, `isOpen` included.
 *
 * @param {Object} item  Accordion Block item.
 * @param {string} title Item title.
 * @return {Object} Spec of the `outstand/accordion-item` block.
 */
function convertItem( item, title ) {
	return spec( ITEM, omit( item.attributes, [ 'title' ] ), [
		spec( HEADER, { title }, [ spec( ICON ) ] ),
		spec( PANEL, {}, convertLegacyBlocks( item.innerBlocks ?? [] ) ),
	] );
}

/**
 * Converts an Accordion Block accordion into a tree of block specs.
 *
 * The accordion keeps its attributes. Inner blocks that are not items are dropped.
 * Items without a title are dropped too, because Accordion Block does not display
 * them. Content blocks stay as they are.
 *
 * @param {Object}   attributes  Accordion Block accordion attributes.
 * @param {Object[]} innerBlocks Accordion Block item blocks.
 * @return {Object} Spec of the `outstand/accordion` block.
 */
export function convertLegacyAccordion( attributes, innerBlocks ) {
	const items = ( innerBlocks ?? [] )
		.filter(
			( block ) =>
				block.name === LEGACY_ITEM &&
				isDisplayedTitle( block.attributes?.title )
		)
		.map( ( block ) => convertItem( block, block.attributes.title ) );

	return spec( ACCORDION, { ...attributes }, items );
}
