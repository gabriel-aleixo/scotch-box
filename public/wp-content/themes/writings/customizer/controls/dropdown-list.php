<?php
/**
 * Button style.
 */
function writings_button_class() {
	$output = array(
		  ''       => esc_html__( 'default', 'writings' ),
		  'secondary '       => esc_html__( 'gray', 'writings' ),
		  'success '       => esc_html__( 'green', 'writings' ),
		  'alert '       => esc_html__( 'red', 'writings' ),
		  'warning '       => esc_html__( 'orange', 'writings' ),
		  'hollow '       => esc_html__( 'hollow', 'writings' ),
		  'secondary hollow '       => esc_html__( 'gray hollow', 'writings' ),
		  'success hollow '       => esc_html__( 'green hollow', 'writings' ),
		  'alert hollow '       => esc_html__( 'red hollow', 'writings' ),
		  'warning hollow '       => esc_html__( 'orange hollow', 'writings' ),
	);
	return $output;
}

/**
 * Category List.
 */
function writings_customizer_category_list( $args = array() ) {
	$args = wp_parse_args( $args, array( 'hide_empty' => 1 ) );
	$cats = get_categories( $args );
	$output = array();
	$output[''] = esc_html__( '&mdash; Select &mdash;', 'writings' );
	foreach( $cats as $cat ) {
		$output[$cat->term_id] = sprintf('%s (%s)', $cat->name, $cat->count );
	}
	return $output;
}

/**
 * Tag List.
 */
function writings_customizer_tag_list( $args = array() ) {
	$args = wp_parse_args( $args, array( 'hide_empty' => 1 ) );
	$tags = get_tags( $args );
	$output = array();
	$output[''] = esc_html__( '&mdash; Select &mdash;', 'writings' );
	foreach( $tags as $tag ) {
		$output[$tag->term_id] = sprintf('%s (%s)', $tag->name, $tag->count );
	}
	return $output;
}

/**
 * Post Formats.
 */
function writings_customizer_post_format() {
	$output = array(
		  'post-format-video'       => esc_html__( 'Video', 'writings' ),
		  'post-format-audio'       => esc_html__( 'Audio', 'writings' ),
		  'post-format-image'       => esc_html__( 'Image', 'writings' ),
	);
	return $output;
}

/**
 * Featured Cat Layout.
 */
function writings_customizer_featured_category_layout() {
	$output = array(
		  'boxed'       => esc_html__( 'Post Boxed', 'writings' ),
		  'metro'       => esc_html__( 'Metro Box', 'writings' ),
	);
	return $output;
}

/**
 * Number Post.
 */
function writings_number_post() {
	$output = array(
		  '3'       => '3',
		  '4'       => '4',
		  '6'       => '6',
		  '9'       => '9',
		  '10'     => '10',
	);
	return $output;
}

/**
 * Number Length.
 */
function writings_number_length() {
	$output = array(
		  '5'       => '5',
		  '7'       => '7',
		  '9'       => '9',
		  '12'       => '12',
	);
	return $output;
}

/**
 * Font weight list.
 */
function writings_customizer_font_weight_list() {
	$output = array(
			'100'       => esc_html__( 'Ultra Light', 'writings' ),
			'200'       => esc_html__( 'Light', 'writings' ),
			'300'       => esc_html__( 'Book', 'writings' ),
			'400'       => esc_html__( 'Regular', 'writings' ),
			'500'       => esc_html__( 'Medium', 'writings' ),
			'600'       => esc_html__( 'Semi-Bold', 'writings' ),
			'700'       => esc_html__( 'Bold', 'writings' ),
			'800'       => esc_html__( 'Extra Bold', 'writings' ),
			'900'       => esc_html__( 'Ultra Bold', 'writings' )
	);
	return $output;
}

/**
 * Font size list for main text.
 */
function writings_content_font_size_list() {
	$output = array(
		  	'12'       => esc_html__( '12px', 'writings' ),
		  	'14'       => esc_html__( '14px', 'writings' ),
		  	'16'       => esc_html__( '16px', 'writings' ),
		  	'18'       => esc_html__( '18px', 'writings' ),
		  	'20'       => esc_html__( '20px', 'writings' ),
		  	'22'       => esc_html__( '22px', 'writings' ),
		  	'24'       => esc_html__( '24px', 'writings' ),
	);
	return $output;
}

/**
 * Font size list for headings.
 */
function writings_heading_font_size_list() {
	$output = array(
		  	'18'       => esc_html__( '18px', 'writings' ),
		  	'20'       => esc_html__( '20px', 'writings' ),
		  	'22'       => esc_html__( '22px', 'writings' ),
		  	'24'       => esc_html__( '24px', 'writings' ),
		  	'28'       => esc_html__( '28px', 'writings' ),
		  	'30'       => esc_html__( '30px', 'writings' ),
		  	'32'       => esc_html__( '32px', 'writings' ),
		  	'34'       => esc_html__( '34px', 'writings' ),
		  	'36'       => esc_html__( '36px', 'writings' ),
		  	'38'       => esc_html__( '38px', 'writings' ),
		  	'40'       => esc_html__( '40px', 'writings' ),
		  	'42'       => esc_html__( '42px', 'writings' ),
		  	'46'       => esc_html__( '46px', 'writings' ),
		  	'48'       => esc_html__( '48px', 'writings' ),
		  	'50'       => esc_html__( '50px', 'writings' ),
	);
	return $output;
}

/**
 * Font size list for elements.
 */
function writings_element_font_size_list() {
	$output = array(
		  	'10'       => esc_html__( '10px', 'writings' ),
		  	'12'       => esc_html__( '12px', 'writings' ),
		  	'14'       => esc_html__( '14px', 'writings' ),
		  	'16'       => esc_html__( '16px', 'writings' ),
		  	'18'       => esc_html__( '18px', 'writings' ),
		  	'20'       => esc_html__( '20px', 'writings' ),
	);
	return $output;
}

/**
 * Font size list for main menu.
 */
function writings_menu_font_size_list() {
	$output = array(
		  	'14'       => esc_html__( '14px', 'writings' ),
		  	'16'       => esc_html__( '16px', 'writings' ),
		  	'18'       => esc_html__( '18px', 'writings' ),
		  	'20'       => esc_html__( '20px', 'writings' ),
	);
	return $output;
}

/**
 * Number Line Height.
 */
function writings_line_height() {
	$output = array(
		  '.5'      => '0.5',
		  '1'       => '1',
		  '1.5'     => '1.5',
		  '1.75'    => '1.75',
	);
	return $output;
}