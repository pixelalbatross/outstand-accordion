/**
 * Accordion Header block editor.
 */
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import {
	AlignmentControl,
	BlockControls,
	HeadingLevelDropdown,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { safeHTML } from '@wordpress/dom';

import { useItemExpanded } from '../../hooks/use-item-expanded';
import { ICON } from '../../shared/constants';

const TEMPLATE = [ [ ICON ] ];

/**
 * Returns the heading tag for a level, from `h1` to `h6`.
 *
 * @param {number} level Heading level.
 * @return {string} Tag name.
 */
function getHeadingTag( level ) {
	return `h${ Math.min( 6, Math.max( 1, level || 2 ) ) }`;
}

export default function AccordionHeaderEdit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
	__unstableLayoutClassNames: layoutClassNames,
} ) {
	const { title, level, textAlign } = attributes;
	const isExpanded = useItemExpanded( clientId );
	const hasSelectedIcon = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId ),
		[ clientId ]
	);
	const isEditing = isSelected || hasSelectedIcon;
	const TagName = getHeadingTag( level );

	// The layout classes go on the heading, as on the front end; the button inherits its flex layout.
	const blockProps = useBlockProps( {
		className: clsx( layoutClassNames, {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );
	const { children: iconBlock, ...toggleProps } = useInnerBlocksProps(
		{
			className: 'wp-block-outstand-accordion-header__toggle',
			style: getSpacingClassesAndStyles( attributes ).style,
		},
		{
			allowedBlocks: [ ICON ],
			template: TEMPLATE,
			templateLock: 'all',
			renderAppender: false,
			__unstableDisableLayoutClassNames: true,
		}
	);

	const controls = (
		<BlockControls group="block">
			<HeadingLevelDropdown
				value={ level }
				onChange={ ( value ) => setAttributes( { level: value } ) }
			/>
			<AlignmentControl
				value={ textAlign }
				onChange={ ( value ) => setAttributes( { textAlign: value } ) }
			/>
		</BlockControls>
	);

	if ( isEditing ) {
		return (
			<>
				{ controls }
				<TagName { ...blockProps }>
					<div { ...toggleProps }>
						<RichText
							tagName="span"
							className="wp-block-outstand-accordion-header__title"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __(
								'Accordion title',
								'outstand-accordion'
							) }
							withoutInteractiveFormatting
							disableLineBreaks
						/>
						{ iconBlock }
					</div>
				</TagName>
			</>
		);
	}

	return (
		<>
			{ controls }
			<TagName { ...blockProps }>
				<button
					type="button"
					{ ...toggleProps }
					aria-expanded={ isExpanded ? 'true' : 'false' }
				>
					{ title ? (
						<span
							className="wp-block-outstand-accordion-header__title"
							dangerouslySetInnerHTML={ {
								__html: safeHTML( title ),
							} }
						/>
					) : (
						<span className="wp-block-outstand-accordion-header__title is-placeholder">
							{ __( 'Accordion title', 'outstand-accordion' ) }
						</span>
					) }
					{ iconBlock }
				</button>
			</TagName>
		</>
	);
}
