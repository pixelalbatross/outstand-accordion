/**
 * Icon style and size controls shared by the Accordion and Accordion Icon blocks.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';

import { getIconStyles } from '../../shared/icon-styles';

/**
 * Renders the icon style picker and the size control.
 *
 * @param {Object}                              props               Component props.
 * @param {string}                              props.styleKey      Key of the style in effect.
 * @param {string}                              props.width         CSS length in effect.
 * @param {(key: string) => void}               props.onChangeStyle Called with the chosen style key.
 * @param {(width: (string|undefined)) => void} props.onChangeWidth Called with the CSS length, or undefined when cleared.
 * @return {Element} Controls.
 */
export default function IconSettings( {
	styleKey,
	width,
	onChangeStyle,
	onChangeWidth,
} ) {
	const styles = getIconStyles();

	return (
		<>
			<ToggleGroupControl
				label={ __( 'Style', 'outstand-accordion' ) }
				value={ styleKey }
				isBlock
				onChange={ onChangeStyle }
			>
				{ Object.entries( styles ).map( ( [ key, option ] ) => (
					<ToggleGroupControlOption
						key={ key }
						value={ key }
						label={ option.label }
					/>
				) ) }
			</ToggleGroupControl>
			<UnitControl
				label={ __( 'Size', 'outstand-accordion' ) }
				value={ width }
				units={ [
					{ value: 'px', label: 'px', default: 24 },
					{ value: 'em', label: 'em', default: 1.25 },
					{ value: 'rem', label: 'rem', default: 1.25 },
				] }
				onChange={ ( value ) => onChangeWidth( value || undefined ) }
			/>
		</>
	);
}
