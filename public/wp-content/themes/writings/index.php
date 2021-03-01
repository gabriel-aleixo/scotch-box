<?php
/**
 * The main template file
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

		<?php
			get_template_part( 'template-parts/content', 'header' );
			
			if ( have_posts() ) : ?>
			
				<div id="entry-grid"<?php writings_layout_class(); ?>>
			
					<?php
					/* Start the Loop */
					while ( have_posts() ) : the_post();
						get_template_part( 'template-parts/content', get_post_format() );
					endwhile;
					?>
				
				</div>
		<?php
			else :
				get_template_part( 'template-parts/content', 'none' );
			endif; ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
// Include pagination template part
get_template_part( 'template-parts/navigation/pagination' );

get_footer();
