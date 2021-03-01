<?php
/**
 * Template part for displaying page main content.
 * @package Writings
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
	<?php
		if ( have_posts() ) :
			while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/content', 'front-page' );
			endwhile;
		else :	// I'm not sure it's possible to have no posts when this page is shown, but WTH.
				get_template_part( 'template-parts/content', 'none' );
		endif;
	?>