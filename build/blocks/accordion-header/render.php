<?php
/**
 * Accordion Header block markup.
 *
 * @package Outstand
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

$ids          = Accordion::get_ids( $block );
$is_open      = Accordion::is_open( $block );
$tag_name     = Accordion::get_heading_tag( $attributes );
$button_style = Accordion::get_button_style( $attributes );
$button_attrs = '';

if ( null !== $ids ) {
	$button_attrs = sprintf(
		' id="%1$s" aria-controls="%2$s"',
		esc_attr( $ids['button'] ),
		esc_attr( $ids['panel'] )
	);
}
?>
<<?php echo tag_escape( $tag_name ); ?> <?php echo get_block_wrapper_attributes( [ 'class' => Accordion::get_header_class( $attributes ) ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<button
		type="button"
		class="wp-block-outstand-accordion-header__toggle"
		<?php echo $button_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped when built. ?>
		aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>"
		<?php if ( '' !== $button_style ) : ?>
			style="<?php echo esc_attr( $button_style ); ?>"
		<?php endif; ?>
		data-wp-on--click="actions.toggle"
		data-wp-bind--aria-expanded="context.isOpen"
	>
		<span class="wp-block-outstand-accordion-header__title"><?php echo Accordion::get_title_html( (string) ( $attributes['title'] ?? '' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses(). ?></span>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</button>
</<?php echo tag_escape( $tag_name ); ?>>
