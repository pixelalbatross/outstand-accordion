<?php
/**
 * Accordion Panel block markup.
 *
 * @package Outstand
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

$ids = Accordion::get_ids( $block );

$extra_attributes = [
	'role'                    => 'region',
	'data-wp-bind--hidden'    => 'state.isHidden',
	'data-wp-on--beforematch' => 'actions.openItem',
];

if ( null !== $ids ) {
	$extra_attributes['id']              = $ids['panel'];
	$extra_attributes['aria-labelledby'] = $ids['button'];
}
?>
<div <?php echo get_block_wrapper_attributes( $extra_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
