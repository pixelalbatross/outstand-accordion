/**
 * Accordion block transforms.
 */
import { createBlock } from '@wordpress/blocks';

import { LEGACY_ACCORDION, convertLegacyAccordion } from '../../shared/legacy';

/**
 * Creates blocks from converter specs, keeping existing blocks as they are.
 *
 * @param {Object} blockSpec Block spec or existing block.
 * @return {Object} Block.
 */
function createFromSpec( blockSpec ) {
	if ( blockSpec.clientId ) {
		return blockSpec;
	}

	return createBlock(
		blockSpec.name,
		blockSpec.attributes,
		blockSpec.innerBlocks.map( createFromSpec )
	);
}

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ LEGACY_ACCORDION ],
			transform: ( attributes, innerBlocks ) =>
				createFromSpec(
					convertLegacyAccordion( attributes, innerBlocks )
				),
		},
	],
};

export default transforms;
