<?php
/**
 * Accordion Item block markup.
 *
 * @package Outstand
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

$is_open = ! empty( $attributes['isOpen'] );

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'                         => $is_open ? 'is-open' : '',
		'data-wp-context'               => wp_json_encode(
			[
				'id'     => (string) ( $block->context[ Blocks::ITEM_ID_CONTEXT ] ?? '' ),
				'isOpen' => $is_open,
			]
		),
		'data-wp-class--is-open'        => 'context.isOpen',
		'data-wp-init'                  => 'callbacks.openByHash',
		'data-wp-on-window--hashchange' => 'callbacks.openByHash',
	]
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
