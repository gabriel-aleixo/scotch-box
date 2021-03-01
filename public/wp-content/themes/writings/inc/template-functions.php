<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Writings
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function writings_body_classes( $classes ) {
    /* using mobile browser */
    if ( wp_is_mobile() ){
        $classes[] = 'wp-is-mobile';
    }
    else{
        $classes[] = 'wp-is-not-mobile';
    }	
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}
	// Adds a class if the front-page
	if ( is_front_page() ) {
		$classes[] = 'front-page';
	}
	// Adds a class if the customizer preview
	if ( is_customize_preview() ) {
		$classes[] = 'customizer-preview';
	}
	// Adds a class of custom-background-image to sites with a custom background image.
	if ( get_background_image() ) {
		$classes[] = 'custom-background-image';
	}
	// Adds a class of group-blog to sites with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}
	// Adds a class for alt mode
	if ( get_theme_mod( 'alt_mode' ) ) {
		$classes[] = 'alt-mode';
	}
	// Dark Mode prepared style
	if ( get_theme_mod( 'dark_mode' ) ) {
		$classes[] = 'dark-mode';
	}
	// Check whether we want the alt nav
	if ( get_theme_mod( 'writings_alt_nav' ) ) {
		$classes[] = 'show-alt-nav';
	}
	
	return $classes;
}
add_filter( 'body_class', 'writings_body_classes' );

/**
 * Adds custom classes to the array of post classes.
 *
 * @param array $classes Classes for the article element.
 * @return array
 */
function writings_post_classes( $classes ) {
	$classes[] = ( has_post_thumbnail() ? 'has-thumbnail' : 'no-thumbnail' );
	
	// Adds a class if the special page
	if ( ( get_post_type() == 'post' ) && ( is_front_page() || is_home() || is_archive() ) ) {
		$classes[] = 'entry-list';
	}
	
	return $classes;
}
add_action( 'post_class', 'writings_post_classes' );

/**
 * Display the classes for the div.
 *
 * @param string|array $class
 * One or more classes to add to the class list.
 */
function writings_layout_class( $classes = '' ) {
	// Separates classes with a single space
	echo 'class="' . join( ' ', writings_set_layout_class( $classes ) ) . '"';
}

/**
 * Adds custom classes to the array of layout classes.
 *
 * @param array $classes Classes for the div element.
 * @return array
 */
function writings_set_layout_class( $class = '' ) {

	// Define classes array
	$classes = array();

	// Grid classes
	if ( is_front_page() || is_home() || is_archive() ) {
		$classes[] = 'entries-list';
	}
	
	// Grid classes
	if ( is_search() ) {
		$classes[] = 'search-results-list';
	}
	
	$classes = array_map( 'esc_attr', $classes );

	// Apply filters to entry post class for child theming
	$classes = apply_filters( 'writings_set_layout_class', $classes );

	// Classes array
	return array_unique( $classes );
}

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function writings_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
	}
}
add_action( 'wp_head', 'writings_pingback_header' );

/**
 * The frontpage or not.
 */
function writings_is_frontpage() {
	return ( is_front_page() && ! is_home() );
}

/**
 * Return an alternative title, without prefix
 * for every type used in the get_the_archive_title().
 */
function writings_remove_archive_title_prefix( $title ) {
    if ( is_category() ) {
        $title = single_cat_title( '', false );
    } elseif ( is_tag() ) {
        $title = single_tag_title( '#', false );
    } elseif ( is_author() ) {
        $title = '<span class="vcard">' . get_the_author() . '</span>';
    } elseif ( is_year() ) {
        $title = get_the_date( 'Y' );
    } elseif ( is_month() ) {
        $title = get_the_date( 'F Y' );
    } elseif ( is_day() ) {
        $title = get_the_date( get_option( 'date_format' ) );
    } elseif ( is_tax( 'post_format', 'post-format-image' ) ) {
        $title = esc_html( _x( 'Images', 'post format archive title', 'writings' ) );
    } elseif ( is_post_type_archive() ) {
        $title = post_type_archive_title( '', false );
    } elseif ( is_tax() ) {
        $title = single_term_title( '', false );
    } else {
        $title = __( 'Archives', 'writings' );
    }
    return $title;
}
add_filter( 'get_the_archive_title', 'writings_remove_archive_title_prefix' );