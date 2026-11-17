/**
 * Accordion block.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import AccordionEdit from './edit';
import AccordionSave from './save';
import transforms from './transforms';
import './style.scss';

registerBlockType( metadata.name, {
	edit: AccordionEdit,
	save: AccordionSave,
	transforms,
} );
