/**
 * Accordion Panel block save: the server renders the wrapper.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function AccordionPanelSave() {
	return <InnerBlocks.Content />;
}
