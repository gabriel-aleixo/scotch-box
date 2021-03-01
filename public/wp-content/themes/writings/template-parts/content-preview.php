<?php
/**
 * Template part for displaying post preview for Home and Archive page
 * Using post_class() here to add special class 'post-preview'
 * @see writings_post_classes()
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */
 
?>


<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php if( has_post_thumbnail() && writings( 'blog_featured_image' ) != 'hidden' && writings( 'position_blog_featured_image' ) == 'above' ) : ?>
		<div class="preview-featured-image">
			<a class="preview-featured-image-link" href="<?php echo esc_url( get_permalink() ); ?>">
				<figure>
					<?php the_post_thumbnail( 'writings-featured-image' ); ?>
				</figure>
			</a>
		</div>
    <?php endif; ?>

	<header class="entry-header">
		<?php if ( is_sticky() && is_home() && ! is_paged() ) : ?>
				<span class="sticky-post"><?php esc_html_e( 'Featured', 'writings' ); ?></span>
		<?php endif; ?>
		<?php
				if ( get_the_title() ) {
					the_title( sprintf( '<h2 class="title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' );
				} else { ?>
				<h2 class="title"><a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><?php esc_html_e( 'Untitled', 'writings' ); ?></a></h2>
		<?php
				} ?>
		<?php if ( 'post' === get_post_type() ) : ?>
				<div class="entry-meta">
					<?php writings_posted_on(); ?>
				</div>
		<?php endif; ?>
	</header>
	
	<?php if( has_post_thumbnail() && writings( 'blog_featured_image' ) != 'hidden' && writings( 'position_blog_featured_image' ) != 'above' ) : ?>
		<div class="preview-featured-image">
			<a class="preview-featured-image-link" href="<?php echo esc_url( get_permalink() ); ?>">
				<figure>
					<?php the_post_thumbnail( 'writings-featured-image' ); ?>
				</figure>
			</a>
		</div>
    <?php endif; ?>
		
	<div class="entry-summary">
		<?php
			$has_more = strpos( $post->post_content, '<!--more' );

			if ( ( is_home() && writings( 'blog_content_full' ) == 'yes' ) || $has_more ) {
					the_content( sprintf(
							/* translators: %s: Name of current post. Only visible to screen readers */
							esc_html__( 'Continue reading%s', 'writings' ),
							'<span class="screen-reader-text">' . get_the_title() . '</span>'
					) );
			} else {
				the_excerpt();
			}
			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'writings' ),
				'after'  => '</div>',
			) );
		?>
	</div>
		
</article>