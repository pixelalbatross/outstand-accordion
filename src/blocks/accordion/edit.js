/**
 * Accordion block editor.
 */
import {
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import IconSettings from '../../components/icon-settings';
import { HEADER, ITEM } from '../../shared/constants';
import { getIconStyle } from '../../shared/icon-styles';

const TEMPLATE = [ [ ITEM ], [ ITEM ] ];

export default function AccordionEdit( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const { headingLevel, iconKey, iconWidth } = attributes;
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const headerClientIds = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );

			return getBlocks( clientId )
				.flatMap( ( item ) => item.innerBlocks )
				.filter( ( block ) => block.name === HEADER )
				.map( ( block ) => block.clientId );
		},
		[ clientId ]
	);

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ ITEM ],
		template: TEMPLATE,
	} );

	// The accordion level sets the level of every header it holds.
	const onChangeLevel = ( level ) => {
		setAttributes( { headingLevel: level } );
		updateBlockAttributes( headerClientIds, { level } );
	};

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					value={ headingLevel }
					onChange={ onChangeLevel }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Icon', 'outstand-accordion' ) }>
					<IconSettings
						styleKey={ getIconStyle( iconKey ).key }
						width={ iconWidth }
						onChangeStyle={ ( value ) =>
							setAttributes( { iconKey: value } )
						}
						onChangeWidth={ ( value ) =>
							setAttributes( { iconWidth: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
