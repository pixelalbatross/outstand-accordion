/**
 * Accordion Header block save: the server renders the heading and its button.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function AccordionHeaderSave() {
	return <InnerBlocks.Content />;
}
