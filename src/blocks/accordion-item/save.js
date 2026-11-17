/**
 * Accordion Item block save: the server renders the wrapper.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function AccordionItemSave() {
	return <InnerBlocks.Content />;
}
