/**
 * Accordion Panel block editor.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { useItemExpanded } from '../../hooks/use-item-expanded';

const TEMPLATE = [ [ 'core/paragraph' ] ];

export default function AccordionPanelEdit( { clientId } ) {
	const isExpanded = useItemExpanded( clientId );

	const blockProps = useBlockProps( { hidden: ! isExpanded } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
