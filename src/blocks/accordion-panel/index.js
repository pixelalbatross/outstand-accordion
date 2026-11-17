/**
 * Accordion Panel block.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import AccordionPanelEdit from './edit';
import AccordionPanelSave from './save';

registerBlockType( metadata.name, {
	edit: AccordionPanelEdit,
	save: AccordionPanelSave,
} );
