<?php
/**
 * @package Writings
 */
function writings_customizer_menu_bar( $options ) {
	/**
	 *	Add section.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'menu_bar',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Menu Bar', 'writings' ),
		  'priority'    => 101,
	);

	/**
	 *	Options.
	 *--------------------------------------------------------------*/
	# Search icon.
	$options[] = array(
		  'slug'        => 'search_display',
		  'opt_type'    => 'toogle_switch',
		  'name'        => esc_html__( 'Add Search item', 'writings' ),
		  'default'     => 0,
		  'section'     => 'menu_bar',
		  'transport'   => 'refresh',
	);
	# Dark-mode icon.
	$options[] = array(
		  'slug'        => 'dark_display',
		  'opt_type'    => 'toogle_switch',
		  'name'        => esc_html__( 'Add Night-mode item', 'writings' ),
		  'default'     => 0,
		  'section'     => 'menu_bar',
		  'transport'   => 'refresh',
	);

	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_menu_bar' );