<?php
/**
 * Shortcode handler for Rosehill TPV® Colour Mixer
 *
 * @package Rosehill_TPV_Mixer
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Rosehill_Mixer_Shortcode {

    /**
     * Render the mixer shortcode
     *
     * @param array $atts Shortcode attributes
     * @return string HTML output
     */
    public function render($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts([
            'width' => '100%',
            'height' => 'auto',
            'max-width' => '1400px'
        ], $atts, 'rosehill_tpv_mixer');

        // Start output buffering
        ob_start();
        ?>
        <div class="rosehill-mixer-container" style="width: <?php echo esc_attr($atts['width']); ?>; max-width: <?php echo esc_attr($atts['max-width']); ?>; height: <?php echo esc_attr($atts['height']); ?>; margin: 0 auto;">
            <div id="rosehill-tpv-mixer-root"></div>
            <noscript>
                <div style="padding: 40px; text-align: center; background: #f8f9fa; border: 2px solid #ddd; border-radius: 8px;">
                    <h3>JavaScript Required</h3>
                    <p>The Rosehill TPV® Colour Mixer requires JavaScript to be enabled in your browser.</p>
                </div>
            </noscript>
        </div>
        <?php
        return ob_get_clean();
    }
}
