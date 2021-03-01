<?php
/**
 * Template part for displaying page content in front-page.php
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */

?>



<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<?php
	if ( writings ( 'hide_frontpage_header' ) != 1 ) {
	?>
	<header class="page-header">
		<div>
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
			<?php
				if( has_excerpt() ):
					the_excerpt();
				endif;
			?>
		</div>
	</header>
<?php
	}
	?>
	
	<?php
		if ( has_post_thumbnail( get_queried_object_id() ) ) :
			echo '<div class="single-featured-image-header">' . get_the_post_thumbnail( get_queried_object_id(), 'writings-featured-image' ) . '</div>';
		endif; ?>

	<?php if ( '' != get_the_content() ) : ?>
	<div class="entry-content">
		<?php
			the_content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'writings' ),
				'after'  => '</div>',
			) );
		?>
	</div>
	<?php endif; ?>

	<?php if ( get_edit_post_link() ) : ?>
		<footer class="entry-footer">
			<?php
				edit_post_link(
					sprintf(
						wp_kses(
							/* translators: %s: Name of current post. Only visible to screen readers */
							__( 'Edit <span class="screen-reader-text">%s</span>', 'writings' ),
							array(
								'span' => array(
									'class' => array(),
								),
							)
						),
						get_the_title()
					),
					'<span class="edit-link">',
					'</span>'
				);
			?>
		</footer><!-- .entry-footer -->
	<?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->
