/**
 * Tells whether an accordion item shows its panel in the editor.
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import { ITEM } from '../shared/constants';

/**
 * Returns whether the item that holds a block shows its panel in the editor.
 *
 * The panel shows when the item opens by default, or while the item or any
 * block inside it is selected, so authors can edit the content.
 *
 * @param {string} clientId Client ID of the item, or of a block inside it.
 * @return {boolean} Whether the panel shows.
 */
export function useItemExpanded( clientId ) {
	return useSelect(
		( select ) => {
			const {
				getBlockAttributes,
				getBlockName,
				getBlockParentsByBlockName,
				hasSelectedInnerBlock,
				isBlockSelected,
			} = select( blockEditorStore );

			const blockName = getBlockName( clientId );
			const itemClientId =
				blockName === ITEM
					? clientId
					: getBlockParentsByBlockName( clientId, ITEM, true )[ 0 ];

			if ( ! itemClientId ) {
				return false;
			}

			return (
				!! getBlockAttributes( itemClientId )?.isOpen ||
				isBlockSelected( itemClientId ) ||
				hasSelectedInnerBlock( itemClientId, true )
			);
		},
		[ clientId ]
	);
}
