/**
 * Reads the icon styles that `Icons::get_styles()` gives the editor.
 */
import { DEFAULT_ICON } from './constants';

/**
 * Returns the icon styles by key, each with `label`, `icon` and an optional `openIcon`.
 *
 * @return {Object<string, Object>} Icon styles.
 */
export function getIconStyles() {
	return window.outstandAccordionIcons ?? {};
}

/**
 * Returns one icon style, or the default style when the key is unknown.
 *
 * Mirrors `Icons::get_style()`.
 *
 * @param {string} key Style key.
 * @return {Object} Style with its `key`.
 */
export function getIconStyle( key ) {
	const styles = getIconStyles();
	let styleKey = key;

	if ( ! styles[ styleKey ] ) {
		styleKey = styles[ DEFAULT_ICON ]
			? DEFAULT_ICON
			: Object.keys( styles )[ 0 ];
	}

	return {
		icon: `outstand-accordion/${ DEFAULT_ICON }`,
		...styles[ styleKey ],
		key: styleKey ?? DEFAULT_ICON,
	};
}
