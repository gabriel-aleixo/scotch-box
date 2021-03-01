<?php

$writings_theme = wp_get_theme();
$active_tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'getting_started';
// Links that are used on this page.
$promo_links = array(
    'premium' => 'http://dinevthemes.com/themes/writings-pro/',
);
?>

<div class="wrap writings-dashboard">

    <div class="page-header wp-clearfix">
        <div class="theme-info">
            <div class="inner">
                <h1><?php esc_html_e( 'Welcome to Writings!', 'writings' ) ?></h1>
                <?php printf( '<p class="ver">%1$s %2$s</p>', esc_html__( 'Version:', 'writings' ), esc_html( $writings_theme->Version ) ); ?>
                <p class="theme-description"><?php echo esc_html( $writings_theme->Description ); ?></p>

                <p class="theme-promo"><?php esc_html_e( 'Get more features and one-on-one support with Writings Pro theme.', 'writings' ); ?></p>
                    <?php
                    // Display link to the Premium.
                    printf( '<a href="%1$s"  class="button button-primary" target="_blank">%2$s</a>', esc_url( $promo_links['premium'] ), esc_html__( 'Get Pro', 'writings' ) );
                    ?>
            </div><!-- .inner -->
        </div><!-- .theme-info -->

        <div class="theme-screenshot">
            <img src="<?php echo esc_url( WRITINGS_DIR_URI . '/screenshot.png' ); ?>" alt="<?php echo esc_attr( $writings_theme->Name ); ?>" />
        </div><!-- .theme-screenshot -->
    </div><!-- .page-header -->

    <h2 class="nav-tab-wrapper wp-clearfix">
        <?php Writings_Welcome_Screen::get_dashboard_page_tabs( $active_tab ); ?>
    </h2><!-- .nav-tab-wrapper -->

    <div class="tab-content wp-clearfix">
        <div class="tab-primary">
            <div class="inner">
                <?php Writings_Welcome_Screen::get_dashboard_page_tab_content( $active_tab ); ?>
            </div><!-- .inner -->
        </div><!-- .tab-primary -->

        <div class="tab-secondary">
            <div class="inner">
                <?php require_once WRITINGS_DIR . '/inc/admin/partials/theme-dashboard-sidebar.php'; ?>
            </div><!-- .inner -->
        </div><!-- .tab-secondary -->
    </div><!-- .tab-content -->
</div><!-- .wrap.about-wrap -->
