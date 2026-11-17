/**
 * Accordion Icon block editor.
 */
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';

import IconSettings from '../../components/icon-settings';
import RegistryIcon from '../../components/registry-icon';
import { useIcons } from '../../hooks/use-icons';
import { ICON_KEY_CONTEXT, ICON_WIDTH_CONTEXT } from '../../shared/constants';
import { getIconStyle } from '../../shared/icon-styles';

const SVG_CLASS = 'wp-block-outstand-accordion-icon__svg';

export default function AccordionIconEdit( {
	attributes,
	setAttributes,
	context,
} ) {
	const { iconKey, width } = attributes;

	// Mirrors render.php: own setting, then the accordion setting, then the default.
	const isOverridden = !! iconKey || !! width;
	const style = getIconStyle( iconKey || context[ ICON_KEY_CONTEXT ] );
	const size = width || context[ ICON_WIDTH_CONTEXT ];
	const icons = useIcons( [ style.icon, style.openIcon ].filter( Boolean ) );

	const blockProps = useBlockProps( {
		className: clsx( { 'has-open-icon': !! style.openIcon } ),
		style: size ? { '--outstand-accordion-icon-size': size } : undefined,
		'aria-hidden': 'true',
		'data-icon': style.key,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Icon', 'outstand-accordion' ) }>
					<p>
						{ isOverridden
							? __(
									'This item overrides the accordion icon.',
									'outstand-accordion'
								)
							: __(
									'This item uses the accordion icon.',
									'outstand-accordion'
								) }
					</p>
					<IconSettings
						styleKey={ style.key }
						width={ size }
						onChangeStyle={ ( value ) =>
							setAttributes( { iconKey: value } )
						}
						onChangeWidth={ ( value ) =>
							setAttributes( { width: value } )
						}
					/>
					{ isOverridden && (
						<Button
							variant="secondary"
							onClick={ () =>
								setAttributes( {
									iconKey: undefined,
									width: undefined,
								} )
							}
						>
							{ __( 'Use accordion icon', 'outstand-accordion' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>
			<span { ...blockProps }>
				<RegistryIcon
					icon={ icons[ style.icon ] }
					className={ `${ SVG_CLASS } is-closed` }
				/>
				{ style.openIcon && (
					<RegistryIcon
						icon={ icons[ style.openIcon ] }
						className={ `${ SVG_CLASS } is-open` }
					/>
				) }
			</span>
		</>
	);
}
