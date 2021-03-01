<?php
/**
 * Template part for displaying recent posts.
 * @package Writings
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div id="recent-post-list" class="recent-post-list">
	<?php
			$number = esc_attr( writings( 'blog_posts_number' ) );
			// Getting posts which have tag
			$args = array(
				'posts_per_page' => $number,
				'ignore_sticky_posts' => 1
			);
			$query = new WP_Query( $args );
				while ( $query->have_posts() ) :		
					$query->the_post();
	?>
	
			<?php
				if ( get_the_title() ) {
					the_title( sprintf( '<h3 class="title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
				} else {
			?>
					<h3 class="title">
						<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark">
							<?php esc_html_e( 'Untitled', 'writings' ); ?>
						</a>
					</h3>
			<?php
				}
			?>
			<?php writings_posted_on(); ?>
				<hr>
	<?php
				endwhile;
			// Reset $post
			wp_reset_postdata();
	?>
</div>