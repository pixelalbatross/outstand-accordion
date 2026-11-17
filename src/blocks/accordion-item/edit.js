/**
 * Accordion Item block editor.
 */
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { useItemExpanded } from '../../hooks/use-item-expanded';
import {
	DEFAULT_HEADING_LEVEL,
	HEADER,
	HEADING_LEVEL_CONTEXT,
	ICON,
	PANEL,
} from '../../shared/constants';

export default function AccordionItemEdit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { isOpen } = attributes;
	const isExpanded = useItemExpanded( clientId );
	const level = context[ HEADING_LEVEL_CONTEXT ] ?? DEFAULT_HEADING_LEVEL;

	const blockProps = useBlockProps( {
		className: clsx( { 'is-open': isExpanded } ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ HEADER, PANEL ],
		template: [ [ HEADER, { level }, [ [ ICON ] ] ], [ PANEL ] ],
		templateLock: 'all',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'outstand-accordion' ) }>
					<ToggleControl
						label={ __( 'Open by default', 'outstand-accordion' ) }
						help={ __(
							'Shows the panel when the page loads.',
							'outstand-accordion'
						) }
						checked={ isOpen }
						onChange={ ( value ) =>
							setAttributes( { isOpen: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
