<?php

/**
 * This file is used to markup the sidebar on the dashboard page.
 * @package Writings
 */

// Links that are used on this page.
$sidebar_links = array(
    'demo' => 'http://demo.dinevthemes.com/writings/',
	'premium' => 'http://dinevthemes.com/wordpress-themes/writings-pro/',
);

?>

<div class="tab-section">
    <h4 class="section-title"><?php esc_html_e( 'Demo Website', 'writings' ); ?></h4>

    <p><?php esc_html_e( 'You can look live theme on the demo website. There you will also find a description of the main features of the theme.', 'writings' ); ?></p>

    <p>
    <?php
        // Display a link to the demo website.
        printf( '<a href="%1$s" target="_blank">%2$s</a>', esc_url( $sidebar_links['demo'] ), esc_html__( 'View Demo', 'writings' ) );
    ?>
    </p>
</div><!-- .tab-section -->

<div class="tab-section">
    <h4 class="section-title"><?php esc_html_e( 'Get More Features', 'writings' ); ?></h4>

    <p><?php esc_html_e( 'Get more features and one-on-one support with Pro version.', 'writings' ); ?></p>

    <p>
    <?php
        // Display link to the Premium.
        printf( '<a href="%1$s"  class="button button-primary" target="_blank">%2$s</a>', esc_url( $sidebar_links['premium'] ), esc_html__( 'Get Pro', 'writings' ) );
    ?>
    </p>
</div><!-- .tab-section -->
