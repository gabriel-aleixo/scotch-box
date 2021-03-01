<?php
/**
 * Block Patterns
 * 
 * @link https://developer.wordpress.org/reference/functions/register_block_pattern/
 * @link https://developer.wordpress.org/reference/functions/register_block_pattern_category/
 *
 * @package Writings
 * @since   1.3.0
 */

/**
 * Register Block Pattern Category.
 */
if ( function_exists( 'register_block_pattern_category' ) ) {
	register_block_pattern_category(
		'writings',
		array( 'label' => __( 'Writings Patterns', 'writings' ) )
	);
}

/**
 * Register Block Patterns.
 */
if ( function_exists( 'register_block_pattern' ) ) {

	// Latest Posts.
	register_block_pattern(
		'writings/latest-posts',
		array(
			'title'         => esc_html__( 'Latest Posts', 'writings' ),
			'categories'    => array( 'writings' ),
			'viewportWidth' => 720,
			'content'       => '<!-- wp:latest-posts {"postsToShow":3,"displayPostContent":true,"excerptLength":11,"displayPostDate":true,"displayFeaturedImage":true,"featuredImageAlign":"right","align":"center","className":"front-page-section"} /-->',
		)
	);	

}