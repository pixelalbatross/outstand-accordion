/**
 * Reads icons from the WordPress icon registry.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Returns the named icons from the core `root/icon` entity, shared with the
 * core Icon block. Each icon loads with its own request.
 *
 * @param {string[]} names Icon names, such as `outstand-accordion/plus`.
 * @return {Object<string, Object>} Icon records with name, label, content and collection, by name.
 */
export function useIcons( names ) {
	const key = names.join( '|' );

	return useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );
			const icons = {};

			key.split( '|' )
				.filter( Boolean )
				.forEach( ( name ) => {
					const icon = getEntityRecord( 'root', 'icon', name );

					if ( icon ) {
						icons[ name ] = icon;
					}
				} );

			return icons;
		},
		[ key ]
	);
}
