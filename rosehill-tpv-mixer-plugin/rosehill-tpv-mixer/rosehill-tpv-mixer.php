<?php
/**
 * Plugin Name: Rosehill TPV® Colour Mixer
 * Plugin URI: https://tpv.rosehill.group
 * Description: Interactive color mixing tool for creating custom TPV® rubber granule blends with real-time visualization and professional reporting
 * Version: 1.0.1
 * Author: Rosehill Group
 * Author URI: https://rosehill.group
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: rosehill-tpv-mixer
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ROSEHILL_MIXER_VERSION', '1.0.1');
define('ROSEHILL_MIXER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ROSEHILL_MIXER_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include shortcode handler
require_once ROSEHILL_MIXER_PLUGIN_DIR . 'includes/class-mixer-shortcode.php';

/**
 * Enqueue scripts and styles for the mixer
 */
function rosehill_mixer_enqueue_scripts() {
    global $post;

    // Only load on pages/posts with shortcode
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'rosehill_tpv_mixer')) {

        // External dependencies (CDN) - Load in header
        wp_enqueue_script(
            'react',
            'https://unpkg.com/react@18/umd/react.production.min.js',
            [],
            '18',
            false
        );

        wp_enqueue_script(
            'react-dom',
            'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            ['react'],
            '18',
            false
        );

        wp_enqueue_script(
            'd3-delaunay',
            'https://unpkg.com/d3-delaunay@6.0.4/dist/d3-delaunay.min.js',
            [],
            '6.0.4',
            false
        );

        wp_enqueue_script(
            'threejs',
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
            [],
            'r128',
            false
        );

        wp_enqueue_script(
            'three-orbit-controls',
            'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
            ['threejs'],
            '0.128.0',
            false
        );

        // Local jsPDF
        wp_enqueue_script(
            'jspdf',
            ROSEHILL_MIXER_PLUGIN_URL . 'assets/js/jspdf.umd.min.2.5.1.js',
            [],
            '2.5.1',
            true
        );

        // Mixer application (depends on all above)
        wp_enqueue_script(
            'rosehill-mixer-app',
            ROSEHILL_MIXER_PLUGIN_URL . 'assets/js/mixer-app.js',
            ['react', 'react-dom', 'd3-delaunay', 'threejs', 'three-orbit-controls', 'jspdf'],
            ROSEHILL_MIXER_VERSION,
            true
        );

        // Scoped styles
        wp_enqueue_style(
            'rosehill-mixer-css',
            ROSEHILL_MIXER_PLUGIN_URL . 'assets/css/mixer.css',
            [],
            ROSEHILL_MIXER_VERSION
        );
    }
}
add_action('wp_enqueue_scripts', 'rosehill_mixer_enqueue_scripts');

/**
 * Initialize shortcode
 */
function rosehill_mixer_init() {
    $shortcode = new Rosehill_Mixer_Shortcode();
    add_shortcode('rosehill_tpv_mixer', [$shortcode, 'render']);
}
add_action('init', 'rosehill_mixer_init');

/**
 * Add settings link on plugin page
 */
function rosehill_mixer_plugin_links($links) {
    $settings_link = '<a href="https://tpv.rosehill.group" target="_blank">Documentation</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'rosehill_mixer_plugin_links');
