<?php
/**
 * @package Writings
 */
function writings_customizer_frontpage_section( $options ) {
	/**
	 *	Panel.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'front_page_settings',
		  'opt_type'    => 'panel',
		  'name'        => esc_html__( 'Homepage Sections', 'writings' ),
		  'description' => esc_html__( 'Note please: a static page should displayed on the homepage of your site.', 'writings' ),
		  'priority'    => 102,
	);
	
	/**
	 *	Section.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'sections_order',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Visibility & Sorting', 'writings' ),
		  'panel'       => 'front_page_settings',
	);
	
	# Options.
	$options[] = array(
		  'slug'        => 'front_sortable',
		  'opt_type'    => 'sortable',
		  'choices'	   	=> writings_front_elements(),
		  'name'        => esc_html__( 'Set the visibility and order of the sections.', 'writings' ),
		  'description' => esc_html__( 'Drag and drop to sort sections of the front page. To show or hide the section by clicking on the eye icon.', 'writings' ),
		  'default'     => array( 'page_content', 'front_blog' ),
		  'section'     => 'sections_order',
		  'transport'   => 'refresh',
	);

	/**
	 *	Section.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'section_content',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Page Content', 'writings' ),
		  'panel'       => 'front_page_settings',
	);
	
	/**
	 *	Options.
	 *--------------------------------------------------------------*/
	
	# Page Header.
	$options[] = array(
		  'slug'        => 'hide_frontpage_header',
		  'opt_type'    => 'toogle_switch',
		  'name'        => esc_html__( 'Hide Page Title', 'writings' ),
		  'default'     => 0,
		  'section'     => 'section_content',
		  'transport'   => 'refresh',
	);
	
	# Margin Bottom.
	$options[] = array(
		  'slug'        => 'page_content_bottom_margin',
		  'opt_type'    => 'slider_control',
		  'name'        => esc_html__( 'Margin bottom (px)', 'writings' ),
		  'description' => esc_html__( 'Set the height of white space at the bottom after the section.', 'writings' ),
		  'input_attrs' => array(
					'min' => 0,
					'max' => 310,
					'step' => 5,
					),
		  'default'     => 0,
		  'section'     => 'section_content',
		  'transport'   => 'refresh',
	);
	
	/**
	 *	Section.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'section_frontpage_blog',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Blog Section', 'writings' ),
		  'panel'       => 'front_page_settings',
	);
	
	/**
	 *	Options.
	 *--------------------------------------------------------------*/
	 
	# Posts Number.
	$options[] = array(
		  'slug'        => 'blog_posts_number',
		  'opt_type'    => 'number',
		  'name'        => esc_html__( 'Posts Number', 'writings' ),
		  'input_attrs' => array(
					'min' => 0,
					'max' => 999,
					'step' => 1,
					),
		  'default'     => 3,
		  'section'     => 'section_frontpage_blog',
		  'transport'   => 'refresh',
	);

	# Margin Bottom.
	$options[] = array(
		  'slug'        => 'front_blog_margin',
		  'opt_type'    => 'slider_control',
		  'name'        => esc_html__( 'Margin bottom (px)', 'writings' ),
		  'description' => esc_html__( 'Set the height of white space at the bottom after the section.', 'writings' ),
		  'input_attrs' => array(
					'min' => 0,
					'max' => 310,
					'step' => 5,
					),
		  'default'     => 0,
		  'section'     => 'section_frontpage_blog',
		  'transport'   => 'refresh',
	);
	
	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_frontpage_section' );