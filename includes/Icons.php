<?php

namespace Outstand\WP\Accordion;

defined( 'ABSPATH' ) || exit;

use WP_Block_Type_Registry;

class Icons extends BaseModule {

	/**
	 * Icon collection slug.
	 *
	 * @var string
	 */
	const COLLECTION = 'outstand-accordion';

	/**
	 * Directory holding the icon SVG files, relative to the plugin root.
	 *
	 * @var string
	 */
	const SVG_DIR = 'assets/svg/';

	/**
	 * Icon style used when a block asks for an unknown one.
	 *
	 * @var string
	 */
	const DEFAULT_STYLE = 'chevron-down';

	/**
	 * Name of the global variable that gives the icon styles to the editor.
	 *
	 * @var string
	 */
	const EDITOR_VARIABLE = 'outstandAccordionIcons';

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		add_action( 'init', [ $this, 'register_icons' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'add_editor_data' ] );
	}

	/**
	 * Registers the icon collection, one icon per SVG file in `assets/svg/`.
	 *
	 * The registry reads each file the first time the icon is used.
	 *
	 * @return void
	 */
	public function register_icons(): void {
		wp_register_icon_collection(
			self::COLLECTION,
			[
				'label' => __( 'Outstand Accordion', 'outstand-accordion' ),
			]
		);

		$labels = [
			'chevron-down' => __( 'Chevron down', 'outstand-accordion' ),
			'plus'         => __( 'Plus', 'outstand-accordion' ),
			'minus'        => __( 'Minus', 'outstand-accordion' ),
			'caret-down'   => __( 'Caret down', 'outstand-accordion' ),
			'arrow-down'   => __( 'Arrow down', 'outstand-accordion' ),
		];

		foreach ( $labels as $name => $label ) {
			wp_register_icon(
				self::COLLECTION . '/' . $name,
				[
					'label'     => $label,
					'file_path' => OUTSTAND_ACCORDION_PATH . self::SVG_DIR . $name . '.svg',
				]
			);
		}
	}

	/**
	 * Gives the icon styles to the Accordion and Accordion Icon block editor scripts.
	 *
	 * @return void
	 */
	public function add_editor_data(): void {
		$registry = WP_Block_Type_Registry::get_instance();

		foreach ( [ 'outstand/accordion', 'outstand/accordion-icon' ] as $block_name ) {
			$block_type = $registry->get_registered( $block_name );

			if ( ! $block_type instanceof \WP_Block_Type ) {
				continue;
			}

			foreach ( $block_type->editor_script_handles as $handle ) {
				wp_add_inline_script(
					$handle,
					sprintf( 'var %s = %s;', self::EDITOR_VARIABLE, wp_json_encode( self::get_styles() ) ),
					'before'
				);
			}
		}
	}

	/**
	 * Returns the icon styles the Accordion Icon block offers.
	 *
	 * A style shows `icon` while its item is closed. With an `openIcon`, it
	 * shows that icon while the item is open; without one, `icon` turns upside down.
	 *
	 * @return array<string, array{label: string, icon: string, openIcon?: string}> Styles by key.
	 */
	public static function get_styles(): array {
		$styles = [
			'chevron-down' => [
				'label' => __( 'Chevron', 'outstand-accordion' ),
				'icon'  => self::COLLECTION . '/chevron-down',
			],
			'plus'         => [
				'label'    => __( 'Plus / Minus', 'outstand-accordion' ),
				'icon'     => self::COLLECTION . '/plus',
				'openIcon' => self::COLLECTION . '/minus',
			],
			'caret-down'   => [
				'label' => __( 'Caret', 'outstand-accordion' ),
				'icon'  => self::COLLECTION . '/caret-down',
			],
			'arrow-down'   => [
				'label' => __( 'Arrow', 'outstand-accordion' ),
				'icon'  => self::COLLECTION . '/arrow-down',
			],
		];

		/**
		 * Filters the icon styles of the Accordion Icon block.
		 *
		 * Each style names icons registered with `wp_register_icon()`.
		 *
		 * @param array $styles Styles by key, each with `label`, `icon` and an optional `openIcon`.
		 */
		$styles = apply_filters( 'outstand_accordion_icons', $styles );

		return array_filter(
			(array) $styles,
			static fn ( $style ): bool => is_array( $style ) && ! empty( $style['label'] ) && ! empty( $style['icon'] )
		);
	}

	/**
	 * Returns one icon style, or the default style when the key is unknown.
	 *
	 * @param  string $key Style key.
	 * @return array{key: string, icon: string, openIcon?: string}
	 */
	public static function get_style( string $key ): array {
		$styles = self::get_styles();

		if ( ! isset( $styles[ $key ] ) ) {
			$key = isset( $styles[ self::DEFAULT_STYLE ] ) ? self::DEFAULT_STYLE : (string) array_key_first( $styles );
		}

		return array_merge( $styles[ $key ] ?? [ 'icon' => self::COLLECTION . '/' . self::DEFAULT_STYLE ], [ 'key' => $key ] );
	}

	/**
	 * Returns the SVG markup of an icon style: its closed icon, then its open icon when it has one.
	 *
	 * Each `<svg>` gets an `is-icon-collection-<collection>` class, so a theme
	 * can style its own icons, such as outline icons whose stroke the registry drops.
	 *
	 * @param  array $style Style from `get_style()`.
	 * @return string Sanitized SVG markup, or an empty string.
	 */
	public static function render( array $style ): string {
		$markup = self::render_icon( $style['icon'], 'is-closed' );

		if ( ! empty( $style['openIcon'] ) ) {
			$markup .= self::render_icon( $style['openIcon'], 'is-open' );
		}

		return $markup;
	}

	/**
	 * Returns the CSS that sets the icon size, from a CSS length such as `24px` or `1.5em`.
	 *
	 * @param  string $width CSS length.
	 * @return string CSS declaration, or an empty string when the length is not valid.
	 */
	public static function get_size_style( string $width ): string {
		$width = trim( $width );

		if ( ! preg_match( '/^\d*\.?\d+(px|em|rem|%|vw|vh|vmin|vmax|ch|ex)$/', $width ) ) {
			return '';
		}

		return '--outstand-accordion-icon-size:' . $width . ';';
	}

	/**
	 * Returns one registered icon's markup, with the size left to CSS.
	 *
	 * @param  string $name       Icon name, such as `outstand-accordion/plus`.
	 * @param  string $class_name State class for the `<svg>` element.
	 * @return string Sanitized SVG markup, or an empty string when the icon is not registered.
	 */
	private static function render_icon( string $name, string $class_name ): string {
		return wp_get_icon(
			$name,
			[
				'size'  => null,
				'class' => 'wp-block-outstand-accordion-icon__svg ' . $class_name . ' is-icon-collection-' . strtok( $name, '/' ),
			]
		);
	}
}
