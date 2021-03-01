<?php
/**
 * @package Writings
 */
function writings_customizer_google_fonts_options( $options ) {
	/**
	 *	Add Panel.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_panel',
		  'opt_type'    => 'panel',
		  'name'        => esc_html__( 'Fonts', 'writings' ),
		  'priority'    => 84,
	);

	/**
	 *	Add Section General Font.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_main',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'General Font', 'writings' ),
		  'description' => esc_html__( 'General font which is used in the body of the site. Default: Roboto', 'writings' ),
		  'panel'       => 'font_panel',
	);

	# Font Name.
	$options[] = array(
		  'slug'        => 'main_font_name',
		  'opt_type'    => 'google_fonts',
		  'name'        => esc_html__( 'Google Font Name', 'writings' ),
		  'description' => esc_html__( 'Choose a font name. Default: Roboto', 'writings' ),
		  'default'     => 'Roboto',
		  'section'     => 'font_main',
		  'transport'   => 'refresh',
		  'js_mod'      => 'google_fonts',
		  'css_output'  => array( array( 'class' => 'body', 'style' => 'font-family' ) ),
	);

	# Font size.
	$options[] = array(
		  'slug'        => 'main_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 20px', 'writings' ),
		  'choices'     => writings_content_font_size_list(),
		  'default'     => '20',
		  'section'     => 'font_main',
		  'transport'   => 'refresh',
		  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'body', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	/**
	 *	Add Section Site Title.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_site_title',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Site Title & Tagline', 'writings' ),
		  'description' => esc_html__( 'Font size that used for Site Title and Tagline (look at the section called Site Identity).', 'writings' ),
		  'panel'       => 'font_panel',
	);
	
	# Site Title Font size.
	$options[] = array(
		  'slug'        => 'site_title_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size for Site Title', 'writings' ),
		  'description' => esc_html__( 'Font size that used for Site Title. Default: 22px', 'writings' ),
		  'choices'     => writings_content_font_size_list(),
		  'default'     => '22',
		  'section'     => 'font_site_title',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.site-title', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	# Tagline Font size.
	$options[] = array(
		  'slug'        => 'site_tagline_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size for Tagline', 'writings' ),
		  'description' => esc_html__( 'Font size that used for Site Tagline. Default: 18px', 'writings' ),
		  'choices'     => writings_content_font_size_list(),
		  'default'     => '18',
		  'section'     => 'font_site_title',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.site-description', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	/**
	 *	Add Section Main Menu.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_menu',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Main Menu', 'writings' ),
		  'description' => esc_html__( 'Used for main menu.', 'writings' ),
		  'panel'       => 'font_panel',
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'menu_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 18px', 'writings' ),
		  'choices'     => writings_menu_font_size_list(),
		  'default'     => '18',
		  'section'     => 'font_menu',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.main-navigation', 'style' => 'font-size', 'mix' => 'px' ) ),
	);

	/**
	 *	Add Section Headings.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_heading',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Headings', 'writings' ),
		  'panel'       => 'font_panel',
	);

	# Font Name.
	$options[] = array(
		  'slug'        => 'heading_font_name',
		  'opt_type'    => 'google_fonts',
		  'name'        => esc_html__( 'Google Font Name', 'writings' ),
		  'description' => esc_html__( 'Choose a font name. Default: Roboto', 'writings' ),
		  'default'     => 'Roboto',
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		  //'js_mod'      => 'google_fonts',
		  'css_output'  => array( array( 'class' => 'h1,h2,h3,h4,h5,h6', 'style' => 'font-family' ) ),
	);

	# Font Weight.
	$options[] = array(
		  'slug'        => 'heading_font_w',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Weight', 'writings' ),
		  'description' => esc_html__( 'Set font-weight. Default: 900/Ultra Bold. Important: Not all fonts support every font-weight.', 'writings' ),
		  'default'     => '900',
		  'choices'     => writings_customizer_font_weight_list(),
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		  //'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'h1,h2,h3,h4,h5,h6', 'style' => 'font-weight' ) ),
	);

	# Font size.
	$options[] = array(
		  'slug'        => 'heading_one_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'H1 Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 40px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '40',
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'h1', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'heading_two_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'H2 Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 36px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '36',
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'h2', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'heading_three_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'H3 Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 32px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '32',
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'h3', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'heading_four_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'H4 Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 28px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '28',
		  'section'     => 'font_heading',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'h4', 'style' => 'font-size', 'mix' => 'px' ) ),
	);

	/**
	 *	Add Section Post Preview Heading.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'preview_heading_font',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Post Preview Heading', 'writings' ),
		  'description' => esc_html__( 'Heading for Post Preview that used for post titles on the blog page.', 'writings' ),
		  'panel'       => 'font_panel',
	);
	
	# Font Name.
	$options[] = array(
		  'slug'        => 'preview_heading_font_name',
		  'opt_type'    => 'google_fonts',
		  'name'        => esc_html__( 'Google Font Name', 'writings' ),
		  'description' => esc_html__( 'Choose a font name. Default: Roboto', 'writings' ),
		  'default'     => 'Roboto',
		  'section'     => 'preview_heading_font',
		  'transport'   => 'refresh',
		  'js_mod'      => 'google_fonts',
		  'css_output'  => array( array( 'class' => '.entry-list .title', 'style' => 'font-family' ) ),
	);

	# Font Weight.
	$options[] = array(
		  'slug'        => 'preview_heading_font_w',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Weight', 'writings' ),
		  'description' => esc_html__( 'Set font-weight. Default: Extra Bold. Important: Not all fonts support every font-weight.', 'writings' ),
		  'default'     => '900',
		  'choices'     => writings_customizer_font_weight_list(),
		  'section'     => 'preview_heading_font',
		  'transport'   => 'refresh',
		  //'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.entry-list .title', 'style' => 'font-weight' ) ),
	);

	# Font size.
	$options[] = array(
		  'slug'        => 'preview_heading_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 40px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '40',
		  'section'     => 'preview_heading_font',
		  'transport'   => 'refresh',
		 // 'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.entry-list .title', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	/**
	 *	Add Section Page Title.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_page_title',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Page Title', 'writings' ),
		  'description' => esc_html__( 'Used for title of the single post/page.', 'writings' ),
		  'panel'       => 'font_panel',
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'page_title_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 50px', 'writings' ),
		  'choices'     => writings_heading_font_size_list(),
		  'default'     => '50',
		  'section'     => 'font_page_title',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.page-title, .page-header .entry-title', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	/**
	 *	Add Section Paragraph.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_paragraph',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Paragraph', 'writings' ),
		  'description' => esc_html__( 'Used for content text, tables, and lists.', 'writings' ),
		  'panel'       => 'font_panel',
	);

	# Font Name.
	$options[] = array(
		  'slug'        => 'paragraph_font_name',
		  'opt_type'    => 'google_fonts',
		  'name'        => esc_html__( 'Google Font Name', 'writings' ),
		  'description' => esc_html__( 'Choose a font name. Default: Roboto', 'writings' ),
		  'default'     => 'Roboto',
		  'section'     => 'font_paragraph',
		  'transport'   => 'refresh',
		  //'js_mod'      => 'google_fonts',
		  'css_output'  => array( array( 'class' => 'p,.entry-content li,.entry-content td', 'style' => 'font-family' ) ),
	);

	# Font Weight.
	$options[] = array(
		  'slug'        => 'paragraph_font_w',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Weight', 'writings' ),
		  'description' => esc_html__( 'Set font-weight. Default: 400/Regular. Important: Not all fonts support every font-weight.', 'writings' ),
		  'default'     => '400',
		  'choices'     => writings_customizer_font_weight_list(),
		  'section'     => 'font_paragraph',
		  'transport'   => 'refresh',
		  //'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'p,.entry-content li,.entry-content td', 'style' => 'font-weight' ) ),
	);

	# Font size.
	$options[] = array(
		  'slug'        => 'paragraph_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 20px', 'writings' ),
		  'choices'     => writings_content_font_size_list(),
		  'default'     => '20',
		  'section'     => 'font_paragraph',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => 'p,.entry-summary,.entry-content li,.entry-content td', 'style' => 'font-size', 'mix' => 'px' ) ),
	);
	
	# Paragraph Line Height.
	$options[] = array(
		  'slug'        => 'paragraph_line_height',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Line Height', 'writings' ),
		  'description' => esc_html__( 'Set line-height. Default: 1.75', 'writings' ),
		  'choices'     => writings_line_height(),
		  'default'     => '1.75',
		  'section'     => 'font_paragraph',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.entry-content p,.entry-summary p', 'style' => 'line-height' ) ),
	);
	
	/**
	 *	Add Section Post Meta.
	 *--------------------------------------------------------------*/
	$options[] = array(
		  'slug'        => 'font_meta',
		  'opt_type'    => 'section',
		  'name'        => esc_html__( 'Post meta', 'writings' ),
		  'description' => esc_html__( 'Used for meta-text of the single post: author, date, categories etc.', 'writings' ),
		  'panel'       => 'font_panel',
	);
	
	# Font size.
	$options[] = array(
		  'slug'        => 'meta_font_size',
		  'opt_type'    => 'select',
		  'name'        => esc_html__( 'Font Size', 'writings' ),
		  'description' => esc_html__( 'Set font-size. Default: 18px', 'writings' ),
		  'choices'     => writings_element_font_size_list(),
		  'default'     => '18',
		  'section'     => 'font_meta',
		  'transport'   => 'refresh',
		//  'js_mod'      => 'css_output',
		  'css_output'  => array( array( 'class' => '.entry-meta, .entry-footer', 'style' => 'font-size', 'mix' => 'px' ) ),
	);

	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_google_fonts_options' );