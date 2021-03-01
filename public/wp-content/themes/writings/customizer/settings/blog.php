<?php
/**
 * @package Writings
 */
function writings_customizer_blog_posts( $options ) {

	/**
	 *	Add Panel.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'blog_post_settings',
		  'opt_type'    => 'panel',
		  'name'        => esc_html__( 'Posts Options', 'writings' ),
		  'description' => esc_html__( 'Here the view of posts options on an posts/archive page and single post.', 'writings' ),
		  'priority'    => 109,
	);

	/**
	 * Section
	 *--------------------------------------------------------------*/
	# Blog Page.
	$options[] = array(
		  'slug'        => 'blog_page',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Posts Page & Archives', 'writings' ),
		 // 'description' => esc_html__( '....', 'writings' ),
		  'panel'       => 'blog_post_settings',
	);

	/**
	 * Options
	 *--------------------------------------------------------------*/
	# Blog Page Title.
	$options[] = array(
		  'slug'        => 'blog_page_title',
		  'opt_type'    => 'text',
		  'name'        => esc_html__( 'Posts Page Title', 'writings' ),
		  'default'     => '',
		  'section'     => 'blog_page',
		  'transport'   => 'refresh',
	);

	# Blog Intro text.
	$options[] = array(
		  'slug'        => 'blog_page_description',
		  'opt_type'    => 'textarea',
		  'name'        => esc_html__( 'Posts Page Description', 'writings' ),
		  'default'     => '',
		  'section'     => 'blog_page',
		  'transport'   => 'refresh',
	);

	# Content Display.
	$options[] = array(
		  'slug'        => 'blog_content_full',
		  'opt_type'    => 'text_radio_button',
		  'choices'		=> array(
							'yes' => esc_html__( 'Yes', 'writings' ),
							'no' => esc_html__( 'No', 'writings' )
						),
		  'name'        => esc_html__( 'Show full posts content', 'writings' ),
		  'description' => esc_html__( 'Do you want to show full posts content on the Blog Home page?', 'writings' ),
		  'default'     => 'no',
		  'section'     => 'blog_page',
		  'transport'   => 'refresh',
		  'sanitize_cb' => 'writings_text_sanitization',
	);
	
	# Featured Image.
	$options[] = array(
		  'slug'        => 'blog_featured_image',
		  'opt_type'    => 'text_radio_button',
		  'choices'		=> array(
							'display' => esc_html__( 'Yes', 'writings' ),
							'hidden' => esc_html__( 'No', 'writings' )
						),
		  'name'        => esc_html__( 'Show Featured Image', 'writings' ),
		  'default'     => 'display',
		  'section'     => 'blog_page',
		  'transport'   => 'refresh',
		  'sanitize_cb' => 'writings_text_sanitization',
	);
	
	# Featured Image position.
	$options[] = array(
		  'slug'        => 'position_blog_featured_image',
		  'opt_type'    => 'text_radio_button',
		  'choices'		=> array(
							'above' => esc_html__( 'Above the title', 'writings' ),
							'below' => esc_html__( 'Below the title', 'writings' )
						),
		  'name'        => esc_html__( 'Where to show a Featured image?', 'writings' ),
		  'default'     => 'below',
		  'section'     => 'blog_page',
		  'transport'   => 'refresh',
		  'sanitize_cb' => 'writings_text_sanitization',
	);

	/**
	 * Section
	 *--------------------------------------------------------------*/
	# Single Post.
	$options[] = array(
		  'slug'        => 'single_post_options',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Single Post', 'writings' ),
		  'panel'       => 'blog_post_settings',
	);

	/**
	 * Options
	 *--------------------------------------------------------------*/
	# Featured Image.
	$options[] = array(
		  'slug'        => 'single_featured_image',
		  'opt_type'    => 'text_radio_button',
		  'choices'		=> array(
							'display' => esc_html__( 'Yes', 'writings' ),
							'hidden' => esc_html__( 'No', 'writings' )
						),
		  'name'        => esc_html__( 'Show Featured Image', 'writings' ),
		  'default'     => 'display',
		  'section'     => 'single_post_options',
		  'transport'   => 'refresh',
		  'sanitize_cb' => 'writings_text_sanitization',
	);
	
	# Featured Image position.
	$options[] = array(
		  'slug'        => 'position_single_featured_image',
		  'opt_type'    => 'text_radio_button',
		  'choices'		=> array(
							'above' => esc_html__( 'Above the title', 'writings' ),
							'below' => esc_html__( 'Below the title', 'writings' )
						),
		  'name'        => esc_html__( 'Where to show a Featured image?', 'writings' ),
		  'default'     => 'below',
		  'section'     => 'single_post_options',
		  'transport'   => 'refresh',
		  'sanitize_cb' => 'writings_text_sanitization',
	);
	
	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_blog_posts' );