<?php
/**
 * 	Helper/Sanitize for sortable multi-check boxes custom control.
 * 	choice items
 */
 

/**
 * Returns front-page sections for the customizer
 */
if ( ! function_exists( 'writings_front_elements' ) ) {

	function writings_front_elements() {

		// Default elements
		$elements = apply_filters( 'writings_front_elements', array(
				'page_content'      => esc_html__( 'Page Content', 'writings' ),
				'front_blog' 		=> esc_html__( 'Blog Posts', 'writings' ),
		) );

		// Return elements
		return $elements;

	}

}

/**
 * Returns front-page sections positioning
 */
if ( ! function_exists( 'writings_front_elements_positioning' ) ) {

	function writings_front_elements_positioning() {

		// Default sections
		$sections = array( 'page_content', 'front_blog' );

		// Get sections from Customizer
		$sections = get_theme_mod( 'front_sortable', $sections );

		// Turn into array if string
		if ( $sections && ! is_array( $sections ) ) {
			$sections = explode( ',', $sections );
		}

		// Apply filters for easy modification
		$sections = apply_filters( 'front_sortable', $sections );

		// Return sections
		return $sections;

	}

}


/**
 * Returns blog entry elements for the customizer
 */
if ( ! function_exists( 'writings_entry_elements' ) ) {

	function writings_entry_elements() {

		// Default elements
		$elements = apply_filters( 'writings_entry_elements', array(
			'featured_image'    => esc_html__( 'Featured Image', 'writings' ),
			'title'       		=> esc_html__( 'Title', 'writings' ),
			'meta' 				=> esc_html__( 'Meta', 'writings' ),
			'content' 			=> esc_html__( 'Content', 'writings' ),
			'read_more'   		=> esc_html__( 'Read More', 'writings' ),
		) );

		// Return elements
		return $elements;

	}

}

/**
 * Returns blog entry elements positioning
 */
if ( ! function_exists( 'writings_entry_elements_positioning' ) ) {

	function writings_entry_elements_positioning() {

		// Default sections
		$sections = array( 'featured_image', 'title', 'meta', 'content', 'read_more' );

		// Get sections from Customizer
		$sections = get_theme_mod( 'sample_writings_sortable', $sections );

		// Turn into array if string
		if ( $sections && ! is_array( $sections ) ) {
			$sections = explode( ',', $sections );
		}

		// Apply filters for easy modification
		$sections = apply_filters( 'sample_writings_sortable', $sections );

		// Return sections
		return $sections;

	}

}