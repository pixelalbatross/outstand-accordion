<?php
/**
 * Accordion Icon block markup.
 *
 * @package Outstand
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

$icon_key = (string) ( $attributes['iconKey'] ?? '' );
if ( '' === $icon_key ) {
	$icon_key = (string) ( $block->context[ Blocks::ICON_KEY_CONTEXT ] ?? '' );
}

$icon_width = (string) ( $attributes['width'] ?? '' );
if ( '' === $icon_width ) {
	$icon_width = (string) ( $block->context[ Blocks::ICON_WIDTH_CONTEXT ] ?? '' );
}

$icon_style = Icons::get_style( $icon_key );

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'       => empty( $icon_style['openIcon'] ) ? '' : 'has-open-icon',
		'style'       => Icons::get_size_style( $icon_width ),
		'aria-hidden' => 'true',
		'data-icon'   => $icon_style['key'],
	]
);
?>
<span <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo Icons::render( $icon_style ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized by the icon registry. ?></span>
