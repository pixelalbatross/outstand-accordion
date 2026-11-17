<?php

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

use WP_Block;

/**
 * Prepares the values the accordion block templates print.
 */
class Accordion {

	/**
	 * Store namespace of the Interactivity API.
	 *
	 * @var string
	 */
	const STORE = 'outstand/accordion';

	/**
	 * Returns the IDs that link an item's toggle button and its panel.
	 *
	 * @param  WP_Block $block Header or panel block.
	 * @return array{button: string, panel: string}|null IDs, or null when the block has no item ID.
	 */
	public static function get_ids( WP_Block $block ): ?array {
		$item_id = (string) ( $block->context[ Blocks::ITEM_ID_CONTEXT ] ?? '' );

		if ( '' === $item_id ) {
			return null;
		}

		return [
			'button' => $item_id . '-button',
			'panel'  => $item_id . '-panel',
		];
	}

	/**
	 * Registers the derived state that hides the panel of a closed item.
	 *
	 * A closed panel gets `hidden="until-found"`, so find-in-page and
	 * fragment links reach its content. An open panel has no `hidden` attribute.
	 *
	 * @return void
	 */
	public static function register_state(): void {
		wp_interactivity_state(
			self::STORE,
			[
				'isHidden' => static function () {
					$context = wp_interactivity_get_context( self::STORE );

					return empty( $context['isOpen'] ) ? 'until-found' : null;
				},
			]
		);
	}

	/**
	 * Returns a header title limited to inline formatting.
	 *
	 * @param  string $title Header title as saved by the rich text field.
	 * @return string
	 */
	public static function get_title_html( string $title ): string {
		$formatting = [
			'class' => true,
			'style' => true,
			'lang'  => true,
			'dir'   => true,
		];

		return wp_kses(
			$title,
			[
				'strong' => $formatting,
				'em'     => $formatting,
				'b'      => $formatting,
				'i'      => $formatting,
				'span'   => $formatting,
				'code'   => $formatting,
				'sub'    => $formatting,
				'sup'    => $formatting,
				'mark'   => $formatting,
				's'      => $formatting,
				'br'     => [],
			]
		);
	}

	/**
	 * Returns whether the item that holds a header or a panel starts open.
	 *
	 * @param  WP_Block $block Header or panel block.
	 * @return bool
	 */
	public static function is_open( WP_Block $block ): bool {
		return ! empty( $block->context[ Blocks::IS_OPEN_CONTEXT ] );
	}

	/**
	 * Returns the heading tag of a header, from `h1` to `h6`.
	 *
	 * @param  array $attributes Header block attributes.
	 * @return string
	 */
	public static function get_heading_tag( array $attributes ): string {
		$level = (int) ( $attributes['level'] ?? 2 );

		return 'h' . min( 6, max( 1, $level ) );
	}

	/**
	 * Returns the classes a header adds to its wrapper.
	 *
	 * @param  array $attributes Header block attributes.
	 * @return string
	 */
	public static function get_header_class( array $attributes ): string {
		$text_align = (string) ( $attributes['textAlign'] ?? '' );

		if ( '' === $text_align ) {
			return '';
		}

		return 'has-text-align-' . sanitize_html_class( $text_align );
	}

	/**
	 * Returns the inline padding of a header's toggle button.
	 *
	 * The padding goes on the button, so the whole padded area toggles the panel.
	 *
	 * @param  array $attributes Header block attributes.
	 * @return string CSS declarations, or an empty string.
	 */
	public static function get_button_style( array $attributes ): string {
		$styles = wp_style_engine_get_styles(
			[
				'spacing' => [
					'padding' => $attributes['style']['spacing']['padding'] ?? null,
				],
			]
		);

		return (string) ( $styles['css'] ?? '' );
	}
}
