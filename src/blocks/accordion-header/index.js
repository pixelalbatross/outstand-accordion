/**
 * Accordion Header block.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import AccordionHeaderEdit from './edit';
import AccordionHeaderSave from './save';
import './editor.scss';
import './style.scss';

registerBlockType( metadata.name, {
	edit: AccordionHeaderEdit,
	save: AccordionHeaderSave,
} );
