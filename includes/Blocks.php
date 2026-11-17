<?php

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

class Blocks extends BaseModule {

	/**
	 * Context key holding the ID that wires an item's header to its panel.
	 *
	 * @var string
	 */
	const ITEM_ID_CONTEXT = 'outstand/accordion-item-id';

	/**
	 * Context key holding whether an item starts open.
	 *
	 * @var string
	 */
	const IS_OPEN_CONTEXT = 'outstand/accordion-is-open';

	/**
	 * Context key holding the icon style an accordion gives to its items.
	 *
	 * @var string
	 */
	const ICON_KEY_CONTEXT = 'outstand/accordion-icon-key';

	/**
	 * Context key holding the icon size an accordion gives to its items.
	 *
	 * @var string
	 */
	const ICON_WIDTH_CONTEXT = 'outstand/accordion-icon-width';

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		add_action( 'init', [ $this, 'register_blocks' ] );
		add_filter( 'render_block_context', [ $this, 'add_item_context' ], 10, 2 );
	}

	/**
	 * Registers every built block and its editor script translations.
	 *
	 * @return void
	 */
	public function register_blocks(): void {
		$metadata_files = glob( OUTSTAND_ACCORDION_DIST_PATH . 'blocks/*/block.json' );

		add_filter( 'block_type_metadata', [ $this, 'set_block_version' ] );

		foreach ( $metadata_files ?: [] as $metadata_file ) {
			$block_type = register_block_type_from_metadata( dirname( $metadata_file ) );

			if ( ! $block_type instanceof \WP_Block_Type ) {
				continue;
			}

			foreach ( $block_type->editor_script_handles as $handle ) {
				wp_set_script_translations( $handle, 'outstand-accordion', OUTSTAND_ACCORDION_PATH . 'languages' );
			}
		}

		remove_filter( 'block_type_metadata', [ $this, 'set_block_version' ] );
	}

	/**
	 * Versions a plugin block with a hash of its stylesheets, so each stylesheet URL changes
	 * whenever a stylesheet's contents do. WordPress versions block styles from block.json's
	 * `version`, so the hash replaces any version set there. Blocks with no stylesheet files
	 * keep their metadata as is.
	 *
	 * @param  array $metadata Block metadata read from block.json.
	 * @return array
	 */
	public function set_block_version( array $metadata ): array {
		$block_file = $metadata['file'] ?? '';
		$dist_path  = wp_normalize_path( (string) realpath( OUTSTAND_ACCORDION_DIST_PATH ) );

		if ( '' === $dist_path || ! str_starts_with( $block_file, $dist_path ) ) {
			return $metadata;
		}

		$hashes = [];

		foreach ( [ 'style', 'editorStyle', 'viewStyle' ] as $field ) {
			foreach ( (array) ( $metadata[ $field ] ?? [] ) as $style ) {
				$style_path = remove_block_asset_path_prefix( $style );

				// Entries without the `file:` prefix are handles registered elsewhere.
				if ( $style_path === $style ) {
					continue;
				}

				$style_file = dirname( $block_file ) . '/' . $style_path;

				if ( is_readable( $style_file ) ) {
					$hashes[] = md5_file( $style_file );
				}
			}
		}

		if ( empty( $hashes ) ) {
			return $metadata;
		}

		$metadata['version'] = substr( md5( implode( '', $hashes ) ), 0, 20 );

		return $metadata;
	}

	/**
	 * Gives every accordion item a unique ID, which its header and panel read
	 * to link the toggle button and the panel with ARIA attributes.
	 *
	 * The ID exists only while the page renders, so saved content stays free of it.
	 *
	 * @param  array $context      Block context.
	 * @param  array $parsed_block Block being rendered.
	 * @return array
	 */
	public function add_item_context( $context, $parsed_block ): array {
		$context    = (array) $context;
		$block_name = $parsed_block['blockName'] ?? '';

		if ( 'outstand/accordion-item' !== $block_name ) {
			return $context;
		}

		$context[ self::ITEM_ID_CONTEXT ] = wp_unique_id( 'outstand-accordion-item-' );

		return $context;
	}
}
