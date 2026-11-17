<?php
/**
 * Accordion block markup.
 *
 * @package Outstand
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 */

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

Accordion::register_state();

?>
<div <?php echo get_block_wrapper_attributes( [ 'data-wp-interactive' => Accordion::STORE ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
