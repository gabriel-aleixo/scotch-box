<?php
/**
 * Template part for displaying search results
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<header class="entry-header">
		<?php if ( 'post' === get_post_type() ) : ?>
				<span><?php esc_html_e( 'Post', 'writings' ); ?></span>
		<?php endif; ?>
		<?php if ( 'page' === get_post_type() ) : ?>
				<span><?php esc_html_e( 'Page', 'writings' ); ?></span>
		<?php endif; ?>
		<?php
				if ( get_the_title() ) {
					the_title( sprintf( '<h2 class="title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' );
				} else { ?>
				<h2 class="title"><a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><?php esc_html_e( 'Untitled', 'writings' ); ?></a></h2>
		<?php
				} ?>
	</header>
	
	<div class="entry-summary">
		<?php the_excerpt(); ?>
	</div>
		
</article>
