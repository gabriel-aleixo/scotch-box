<?php

/**
 * This file is used to markup the "Getting Started" section on the dashboard page.
 *
 * @package Writings
 */

// Links that are used on this page.
$getting_started_links = array(
    'demo'          => 'http://demo.dinevthemes.com/writings/',
    'docs'          => 'http://dinevthemes.com/documentation-category/writings-theme-doc/',
	'premium'       => 'http://dinevthemes.com/wordpress-themes/writings-pro/',
	'wpforms'       => 'https://wordpress.org/plugins/wpforms-lite/',
	'atomic_blocks' => 'https://wordpress.org/plugins/atomic-blocks/',
    'co_blocks'     => 'https://wordpress.org/plugins/coblocks/',
    'getwid' => 'https://wordpress.org/plugins/getwid/'
);

?>

<div class="tab-section">
    <h3 class="section-title"><?php esc_html_e( 'Front Page Setup', 'writings' ); ?></h3>

    <p><?php esc_html_e( 'Create a new by going to Pages > Add New. Give your page a name (Title field). In the same way create a blank page for the Blog Page.', 'writings' ); ?></p>
    <p><?php esc_html_e( 'Now you can go to Appearance > Customize > Homepage Settings and choose your new created Page as your Front Page.', 'writings' ); ?></p>
    <p><?php esc_html_e( 'When you have set a static page for your homepage displays, you can make some settings for the front page, go to Customizer > Front Page Sections.', 'writings' ); ?></p>
    <p><?php esc_html_e( 'The theme now provide its block pattern of recent posts, which you can use when create a Frontpage (assign a static page to be homepage displayed) or as recommended posts list at the end of post. ', 'writings' ); ?></p>

</div>
<!-- .tab-section -->

<div class="tab-section">
    <h3 class="section-title"><?php esc_html_e( 'Theme Options', 'writings' ); ?></h3>

    <p><?php esc_html_e( 'You can use of the Customizer to provide you with the theme options. Press the button below to open the Customizer and start making changes.', 'writings' ); ?></p>

    <p><a href="<?php echo wp_customize_url(); // WPCS: XSS OK. ?>" class="button" target="_blank"><?php esc_html_e( 'Customize Theme', 'writings' ); ?></a></p>
</div>
<!-- .tab-section -->

<div class="tab-section">
    <h3 class="section-title"><?php esc_html_e( 'Recommended plugins', 'writings' ); ?></h3>
    
<ul>
    <li>
    <?php
        // Display link to plugin page.
        printf( '<a href="%1$s" target="_blank">%2$s</a>', esc_url( $getting_started_links['wpforms'] ), esc_html__( 'Contact Form by WPForms', 'writings' ) );
    ?>
    </li>
</ul>

    <p><?php esc_html_e( 'The theme supports plugins that extend the block editor:', 'writings' ); ?></p>
<ul>
    <li>
        <?php
        // Display link to plugin page.
        printf( '<a href="%1$s" target="_blank">%2$s</a>', esc_url( $getting_started_links['getwid'] ), esc_html__( 'Getwid', 'writings' ) );
        ?>
    </li>
    <li>
        <?php
        // Display link to plugin page.
        printf( '<a href="%1$s" target="_blank">%2$s</a>', esc_url( $getting_started_links['atomic_blocks'] ), esc_html__( 'Atomic Blocks', 'writings' ) );
        ?>
    </li>
    <li>
        <?php
        // Display link to plugin page.
        printf( '<a href="%1$s" target="_blank">%2$s</a>', esc_url( $getting_started_links['co_blocks'] ), esc_html__( 'CoBlocks', 'writings' ) );
        ?>
    </li>
</ul>
</div><!-- .tab-section -->
