/**
 * Accordion Icon block.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import AccordionIconEdit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
	edit: AccordionIconEdit,
	save: () => null,
} );
