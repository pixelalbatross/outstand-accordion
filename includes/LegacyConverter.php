<?php

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

/**
 * Converts Accordion Block (`pixelalbatross/accordion`) blocks to Outstand Accordion blocks.
 *
 * An Accordion Block accordion holds `pixelalbatross/accordion-item` blocks. Each item has
 * a `title` attribute, an `isOpen` attribute and its content as inner blocks.
 *
 * `src/shared/legacy.js` converts the same input to the same block tree in the editor.
 */
class LegacyConverter {

	/**
	 * Accordion Block accordion block name.
	 *
	 * @var string
	 */
	const ACCORDION = 'pixelalbatross/accordion';

	/**
	 * Accordion Block item block name.
	 *
	 * @var string
	 */
	const ITEM = 'pixelalbatross/accordion-item';

	/**
	 * Converts every Accordion Block accordion in a block list, at any depth.
	 *
	 * @param  array[] $blocks Parsed blocks.
	 * @param  int     $count  Counts the converted accordions.
	 * @return array[]
	 */
	public static function convert_blocks( array $blocks, int &$count = 0 ): array {
		foreach ( $blocks as $index => $block ) {
			$block_name = $block['blockName'] ?? '';

			if ( self::ACCORDION === $block_name ) {
				$blocks[ $index ] = self::convert_accordion( $block, $count );
				++$count;
				continue;
			}

			if ( ! empty( $block['innerBlocks'] ) ) {
				$blocks[ $index ]['innerBlocks'] = self::convert_blocks( $block['innerBlocks'], $count );
			}
		}

		return $blocks;
	}

	/**
	 * Converts one Accordion Block accordion.
	 *
	 * The accordion keeps its attributes. Inner blocks that are not items are dropped.
	 * Items without a title are dropped too, because Accordion Block does not display them.
	 *
	 * @param  array $block Parsed `pixelalbatross/accordion` block.
	 * @param  int   $count Counts the accordions converted inside the item content.
	 * @return array Parsed `outstand/accordion` block.
	 */
	public static function convert_accordion( array $block, int &$count = 0 ): array {
		$items = [];

		foreach ( $block['innerBlocks'] ?? [] as $item ) {
			$item_name = $item['blockName'] ?? '';

			if ( self::ITEM !== $item_name ) {
				continue;
			}

			$title = $item['attrs']['title'] ?? '';

			if ( ! self::is_displayed_title( $title ) ) {
				continue;
			}

			$items[] = self::convert_item( $item, $title, $count );
		}

		return self::make_block( 'outstand/accordion', $block['attrs'] ?? [], $items );
	}

	/**
	 * Converts one Accordion Block item.
	 *
	 * The title moves to a header with an icon that inherits the accordion icon, and the content moves to a panel.
	 * The item keeps its other attributes, `isOpen` included.
	 *
	 * @param  array  $item  Parsed `pixelalbatross/accordion-item` block.
	 * @param  string $title Item title.
	 * @param  int    $count Counts the accordions converted inside the item content.
	 * @return array Parsed `outstand/accordion-item` block.
	 */
	private static function convert_item( array $item, string $title, int &$count ): array {
		$attributes = $item['attrs'] ?? [];

		unset( $attributes['title'] );

		$header = self::make_block(
			'outstand/accordion-header',
			[ 'title' => $title ],
			[ self::make_block( 'outstand/accordion-icon', [] ) ]
		);
		$panel  = self::make_block( 'outstand/accordion-panel', [], self::convert_blocks( $item['innerBlocks'] ?? [], $count ) );

		return self::make_block( 'outstand/accordion-item', $attributes, [ $header, $panel ] );
	}

	/**
	 * Whether Accordion Block displays an item with this title.
	 *
	 * Accordion Block skips an item when `empty()` is true for its title, so an empty
	 * string and "0" hide the item. Titles that are not strings are treated as hidden too.
	 *
	 * @param  mixed $title Item title.
	 * @return bool
	 */
	private static function is_displayed_title( mixed $title ): bool {
		return is_string( $title ) && '' !== $title && '0' !== $title;
	}

	/**
	 * Builds a parsed block whose saved markup is only its inner blocks.
	 *
	 * @param  string  $name         Block name.
	 * @param  array   $attributes   Block attributes.
	 * @param  array[] $inner_blocks Inner blocks.
	 * @return array
	 */
	private static function make_block( string $name, array $attributes = [], array $inner_blocks = [] ): array {
		return [
			'blockName'    => $name,
			'attrs'        => $attributes,
			'innerBlocks'  => $inner_blocks,
			'innerHTML'    => '',
			'innerContent' => array_fill( 0, count( $inner_blocks ), null ),
		];
	}
}
