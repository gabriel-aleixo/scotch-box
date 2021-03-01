<?php
/**
 * Main functions Writings Theme Customizer
 */

function writings_define_constants() {
	if( ! defined( 'WRITINGS_ADMIN_DIR' ) ) {
		define( 'WRITINGS_ADMIN_DIR', trailingslashit( get_template_directory() . '/customizer' ) );
	}
	if( ! defined( 'WRITINGS_ADMIN_URI' ) ) {
		define( 'WRITINGS_ADMIN_URI', trailingslashit( get_template_directory_uri() . '/customizer/assets' ) );
	}
}
add_action( 'init', 'writings_define_constants' );

/**
 * 	Modify default sections.
 */
function writings_customizer_modify_sections( $wp_customize ) {
	$wp_customize->get_section( 'static_front_page' )->priority  	= 100;
	$wp_customize->get_control( 'background_color'  )->section   	= 'background_image';
	$wp_customize->get_section( 'background_image'  )->title     	= esc_html__( 'Site Background', 'writings' );
}
add_action( 'customize_register', 'writings_customizer_modify_sections' );

/**
 * 	Register JS control types.
 */
function writings_js_control_type( $wp_customize ) {
	$wp_customize->register_control_type( 'Writings_Sortable_Control' );
}
add_action( 'customize_register', 'writings_js_control_type' );

/**
 * 	Load files.
 */
function writings_admin_files() {
	// Customizer
	require_once( WRITINGS_ADMIN_DIR . 'customizer.php' );

	// Custom Controls
	// Array of setting partials
	$control_files = array(
			'dropdown-list',
			'extra-custom-controls',
			'sortable',
	);

	// Loop through and include setting files
	foreach ( $control_files as $file ) {
		require_once( WRITINGS_ADMIN_DIR .'/controls/'. $file .'.php' );
	}

	// Settings
	// Array of setting partials
	$setting_files = array(
			'blog',
			'colors',
			'fonts',
			'front-page',
			'menu-bar',
			'site-identity'
	);

	// Loop through and include setting files
	foreach ( $setting_files as $file ) {
		require_once( WRITINGS_ADMIN_DIR .'/settings/'. $file .'.php' );
	}

	// Helper
	// Array of setting partials
	$helper_files = array(
			'extra-custom-controls',
			'sortable',
	);

	// Loop through and include setting files
	foreach ( $helper_files as $file ) {
		require_once( WRITINGS_ADMIN_DIR .'/controls/helper/'. $file .'.php' );
	}
}
add_action( 'init', 'writings_admin_files' );

/**
 * 	Get default values.
 */
function writings_option_defaults( $key = 'all' ) {
	$defaults = apply_filters( 'writings_option_defaults', array() );
	if( 'all' != $key ) {
		return isset( $defaults[$key] ) ? $defaults[$key] : NULL;
	}
	return $defaults;
}

/**
 * 	Retrieve and display value.
 * 	Replacement: get_theme_mod( $key ) - writings( $key )
 */
function writings( $key = '', $default = null, $echo = false ) {
	$value  = get_theme_mod( $key, $default );
	$output = ( $value != $default ) ? $value : writings_option_defaults( $key );
	if( $echo ) {
		echo $output;
	}
	else {
		return $output;
	}
}