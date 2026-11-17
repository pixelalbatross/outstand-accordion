<?php // phpcs:ignore Generic.Commenting.DocComment.MissingShort
/**
 * @wordpress-plugin
 * Plugin Name:       Outstand Accordion
 * Description:       Accessible accordion blocks for the block editor, powered by the Interactivity API.
 * Plugin URI:        https://outstand.site/?utm_source=wp-plugins&utm_medium=outstand-accordion&utm_campaign=plugin-uri
 * Requires at least: 7.1
 * Requires PHP:      8.2
 * Version:           1.0.0
 * Author:            Outstand
 * Author URI:        https://outstand.site/?utm_source=wp-plugins&utm_medium=outstand-accordion&utm_campaign=author-uri
 * License:           GPL-3.0-or-later
 * License URI:       https://spdx.org/licenses/GPL-3.0-or-later.html
 * Update URI:        https://outstand.site/
 * GitHub Plugin URI: https://github.com/pixelalbatross/outstand-accordion
 * Text Domain:       outstand-accordion
 * Domain Path:       /languages
 */

namespace Outstand\WP\Accordion;

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'OUTSTAND_ACCORDION_VERSION', '1.0.0' );
define( 'OUTSTAND_ACCORDION_BASENAME', plugin_basename( __FILE__ ) );
define( 'OUTSTAND_ACCORDION_URL', plugin_dir_url( __FILE__ ) );
define( 'OUTSTAND_ACCORDION_PATH', plugin_dir_path( __FILE__ ) );
define( 'OUTSTAND_ACCORDION_DIST_URL', OUTSTAND_ACCORDION_URL . 'build/' );
define( 'OUTSTAND_ACCORDION_DIST_PATH', OUTSTAND_ACCORDION_PATH . 'build/' );

if ( file_exists( OUTSTAND_ACCORDION_PATH . 'vendor/autoload.php' ) ) {
	require_once OUTSTAND_ACCORDION_PATH . 'vendor/autoload.php';
}

if ( class_exists( PucFactory::class ) ) {
	PucFactory::buildUpdateChecker(
		'https://github.com/pixelalbatross/outstand-accordion/',
		__FILE__,
		'outstand-accordion'
	)->setBranch( 'main' );
}

add_action(
	'plugins_loaded',
	function () {
		Plugin::get_instance()->enable();
	}
);
