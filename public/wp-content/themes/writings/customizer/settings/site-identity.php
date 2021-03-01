<?php
/**
 * @package Writings
 */

function writings_customizer_site_title( $options ) {
	/**
	 *	Add Options.
	 *--------------------------------------------------------------*/
	# Disable Title.
	$post_settings = array(
		  'site_title_hide'      => esc_html__( 'Hide Site Title', 'writings' ),
	);
	foreach( $post_settings as $key => $name ) {
		$options[] = array(
			  'slug'        => $key,
			  'opt_type'    => 'checkbox',
			  'name'        => $name,
			  // 'description'        => esc_html__( 'If there is no logo, display the Site Title on the Menu Bar.', 'writings' ),
			  'default'     => 0,
			  'section'     => 'title_tagline',
			  'priority' => 10
		);
	}
	# Disable Tagline.
	$post_settings = array(
		  'site_tagline_hide'      => esc_html__( 'Hide Tagline', 'writings' ),
	);
	foreach( $post_settings as $key => $name ) {
		$options[] = array(
			  'slug'        => $key,
			  'opt_type'    => 'checkbox',
			  'name'        => $name,
			  // 'description'        => esc_html__( 'If there is no logo, display the Tagline on the Menu Bar.', 'writings' ),
			  'default'     => 0,
			  'section'     => 'title_tagline',
			  'priority' => 20
		);
	}

	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_site_title' );