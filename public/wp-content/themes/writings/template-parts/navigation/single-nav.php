<?php
/**
 * Single Post Navigation
 */
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
	if ( get_post_type() == 'post' ) :
		// Previous/next post navigation.
		the_post_navigation( array(
				'next_text' => '<span class="meta-nav" aria-hidden="true">' . esc_html__( 'Next', 'writings' ) . '</span> ' .
					'<span class="screen-reader-text">' . esc_html__( 'Next post:', 'writings' ) . '</span> ' .
					'<span class="post-title">%title</span>',
				'prev_text' => '<span class="meta-nav" aria-hidden="true">' . esc_html__( 'Previous', 'writings' ) . '</span> ' .
					'<span class="screen-reader-text">' . esc_html__( 'Previous post:', 'writings' ) . '</span> ' .
					'<span class="post-title">%title</span>',
		) );
	endif;