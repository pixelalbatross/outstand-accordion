/**
 * Accordion Item block.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import AccordionItemEdit from './edit';
import AccordionItemSave from './save';

registerBlockType( metadata.name, {
	edit: AccordionItemEdit,
	save: AccordionItemSave,
} );
