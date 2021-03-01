<?php
/**
 * @package Writings
 */
function writings_customizer_add_colors( $options ) {

	/**
	 *	Options.
	 *---------------------------------------------------------*/
	 
	# Body Color.
	$options[] = array(
		  'slug'        => 'primary_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Primary color', 'writings' ),
		  'description' => esc_html__( 'Applies to most design elements, body text, and headings.', 'writings' ),
		  'default'     => '#2b2b2b',
		  'section'     => 'colors',
		  'transport'   => 'postMessage',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
				array( 
					'class' => 'body, mark, label, body a, .main-navigation a, .search-icon:before, .no-thumbnail .title, .no-thumbnail .sticky-post, .infinite-scroll #infinite-handle button:hover, .infinite-scroll #infinite-handle button:focus, blockquote p, .gallery-caption, input, select, textarea, h1, h2, h3, h4, h5, h6, .page-numbers a, .page-numbers span',
					'style' => 'color'
				         ),
				array( 
					'class' => '.single-post .nav-links',
					'style' => 'border-color'
				         )
				)
	);
	
	# Accent Color.
	$options[] = array(
		  'slug'        => 'accent_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Link text color', 'writings' ),
		  'default'     => '#2c2c2c',
		  'section'     => 'colors',
		  'transport'   => 'refresh',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => '.entry-content a, a.comment-reply-link, .edit-link a',
				  'style' => 'color'
			),
			array(
				  'class' => '.entry-content a',
				  'style' => 'border-color'
			)
		)
	);

	# Hover Color.
	$options[] = array(
		  'slug'        => 'hover_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Link text color on hover', 'writings' ),
		  'default'     => '#000',
		  'section'     => 'colors',
		  'transport'   => 'refresh',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => '.entry-content a:hover, .main-navigation li:hover > a, .main-navigation li.focus > a',
				  'style' => 'color'
			),
			array(
				  'class' => '.entry-content a:hover',
				  'style' => 'border-color'
			)
		)
	);
	
	# Secondary Color.
	$options[] = array(
		  'slug'        => 'secondary_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Meta text color', 'writings' ),
		  'description' => esc_html__( 'Is applied to the to the secondary design elements, and meta text about the publication, such as date, author, etc..', 'writings' ),
		  'default'     => '#b2b2b2',
		  'section'     => 'colors',
		  'transport'   => 'postMessage',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => '.entry-meta *, .entry-footer *, .comment-metadata time, .site-info, .site-info a, .meta-nav, .main-navigation .current-menu-item > a, .main-navigation .current-menu-ancestor > a, .wp-caption-text',
				  'style' => 'color'
			)
		)
	);
	
	# Primary menu.
	$options[] = array(
		  'slug'        => 'submenu_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Primary menu: submenu background', 'writings' ),
		  'default'     => '#2c2c2c',
		  'section'     => 'colors',
		  'transport'   => 'refresh',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => '.main-navigation ul ul li,.dark-mode .main-navigation ul ul li',
				  'style' => 'background-color'
			),
			array(
				  'class' => '.main-navigation ul ul:before',
				  'style' => 'border-bottom-color'
			)
		)
	);
	
	# Buttons color.
	$options[] = array(
		  'slug'        => 'button_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Buttons color', 'writings' ),
		  'default'     => '#2c2c2c',
		  'section'     => 'colors',
		  'transport'   => 'postMessage',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => 'button, input[type="button"], input[type="submit"], .button, .page-numbers span.current, .social-navigation a:hover',
				  'style' => 'background-color'
			),
			array(
				  'class' => '.social-navigation a',
				  'style' => 'fill'
			),
			array(
				  'class' => '.page-numbers span.current',
				  'style' => 'border-color'
			)
		)
	);
	
	# Button color on hover.
	$options[] = array(
		  'slug'        => 'button_hover_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Button color on hover', 'writings' ),
		  'default'     => '#b2b2b2',
		  'section'     => 'colors',
		  'transport'   => 'refresh',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => 'button:hover, input[type="button"]:hover, input[type="submit"]:hover, .button:hover',
				  'style' => 'background-color'
			)
		)
	);
	
	# Additional Color.
	$options[] = array(
		  'slug'        => 'additional_color',
		  'opt_type'    => 'color',
		  'name'        => esc_html__( 'Additional Color', 'writings' ),
		  'description' => esc_html__( 'Applies to the fill color of some design elements.', 'writings' ),
		  'default'     => '#dedede',
		  'section'     => 'colors',
		  'transport'   => 'postMessage',
		  'js_mod'      => 'css_output',
		  'css_output'  => array(
			array(
				  'class' => '.no-thumbnail .overlay-wrap, .page-numbers a, .page-numbers span, tbody > tr:nth-child(odd), pre, .comment-reply-link, .edit-link, mark, ins, code, .social-navigation a',
				  'style' => 'background-color'
			),
			array(
				  'class' => '.page-numbers a, .page-numbers span',
				  'style' => 'border-color'
			)
		)
	);

	return $options;
}
add_filter( 'writings_settings_input', 'writings_customizer_add_colors' );