# Outstand Accordion

> Accessible accordion blocks for the block editor, powered by the Interactivity API.

## Features

The **Accordion** block holds **Accordion Item** blocks. Each item holds:

- **Accordion Header**: the heading and the button that opens and closes the item. It holds an **Accordion Icon**.
- **Accordion Panel**: the section the header shows or hides. It accepts any block.

Settings:

- heading level for the whole accordion, from the block toolbar; each header can change its own level;
- open by default, per item;
- icon style and size on the accordion, with a per-item override: chevron, plus/minus, caret or arrow;
- colors, borders, spacing and typography on every block; the header lays out its title and icon with flex controls.

The markup follows the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/): each header is a `<button>` inside a heading, with `aria-expanded` and `aria-controls`; each panel is a region labelled by its button. The server renders the IDs and the open state, so the page is complete before JavaScript loads. Enter and Space toggle a focused header.

Without JavaScript, every panel stays visible and the icons are hidden.

In the editor, a closed item shows its panel while the item or a block inside it is selected.

## Requirements

- WordPress 7.1 or higher
- PHP 8.2 or higher

## Installation

### Manual installation

1. Download the latest release ZIP from the [Releases page](https://github.com/pixelalbatross/outstand-accordion/releases/latest).
2. Go to Plugins > Add New > Upload Plugin in your WordPress admin area.
3. Upload the ZIP file and click Install Now.
4. Activate the plugin.

### Install with Composer

```bash
composer require outstand/accordion
```

Then activate the plugin from your WordPress admin area or with WP-CLI.

## Migrating from Accordion Block

Outstand Accordion replaces [Accordion Block](https://github.com/pixelalbatross/accordion-block) (`pixelalbatross/accordion`). See [MIGRATING.md](MIGRATING.md) to convert existing accordions in the editor or with WP-CLI. While Accordion Block is inactive, Outstand Accordion shows the old accordions on the front end as its own accordions.

## Customization

### Icon styles

The icons are registered with the WordPress icon registry, in the `outstand-accordion` collection. The `outstand_accordion_icons` filter receives the icon styles the Accordion and Accordion Icon blocks offer. A style names a registered icon, and an optional `openIcon` to show while the item is open. A style without `openIcon` turns its icon upside down instead.

```php
add_action(
	'init',
	function () {
		wp_register_icon_collection( 'my-theme', [ 'label' => __( 'My Theme', 'my-theme' ) ] );

		wp_register_icon(
			'my-theme/arrow',
			[
				'label'     => __( 'Arrow', 'my-theme' ),
				'file_path' => get_theme_file_path( 'assets/icons/arrow.svg' ),
			]
		);
	}
);

add_filter(
	'outstand_accordion_icons',
	function ( array $styles ) {
		$styles['my-arrow'] = [
			'label' => __( 'My arrow', 'my-theme' ),
			'icon'  => 'my-theme/arrow',
		];

		return $styles;
	}
);
```

The icon registry keeps only fills, so outline icons need their stroke from CSS. Every icon carries an `is-icon-collection-<collection>` class:

```css
svg.is-icon-collection-my-theme {
	fill: none;
	stroke: currentcolor;
	stroke-width: 2;
}
```

### Events

When a header opens or closes its item, its button dispatches a bubbling `accordion:item:open` or `accordion:item:close` event. The event's `detail.id` is the item ID.

```js
window.addEventListener( 'accordion:item:open', ( event ) => {
	console.log( event.detail.id );
} );
```

### CSS custom properties

| Property | Default | Used by |
| --- | --- | --- |
| `--outstand-accordion-icon-size` | `1.25em` | Accordion Icon: width and height. The block's size setting sets it. |

## Development

```bash
composer install
npm install
npm run build
```

- `composer lint` runs PHPCS.
- `npm run lint:js` and `npm run lint:css` run ESLint and Stylelint.
- `npm run test:js` runs the JavaScript unit tests.

## Changelog

All notable changes to this project are documented in [CHANGELOG.md](https://github.com/pixelalbatross/outstand-accordion/blob/main/CHANGELOG.md).

## License

This project is licensed under the [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later.html).
