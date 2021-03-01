<?php
/**
 * Template part for displaying content header
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */
?>
<?php
		if ( is_home() ) : ?>

			<header class="headline page-header<?php if ( ! writings( 'blog_page_title' ) && ! writings( 'blog_page_description' ) ) { ?> screen-reader-text<?php } ?>">
				<div>
					<h1 class="page-title">
						<?php echo esc_html( writings( 'blog_page_title' ) ); ?>
					</h1>
					<?php if ( writings( 'blog_page_description' ) ) { ?>
						<p><?php echo esc_html( writings( 'blog_page_description' ) ); ?></p>
					<?php } ?>
				</div>
			</header>
<?php
		endif;
		
		if ( is_archive() ) : ?>
			
			<header class="headline page-header">
				<div>
				<?php
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					the_archive_description( '<div class="archive-description">', '</div>' );
				?>
				</div>
			</header>
<?php
		endif;
		
		if ( is_search() && have_posts() ) : ?>
			
			<header class="headline page-header">
				<div>
					<h1 class="page-title">
					<?php
						/* translators: %s: search query. */
						printf( esc_html__( 'Search Results for: %s', 'writings' ), '<span>' . get_search_query() . '</span>' );
					?>
					</h1>
				</div>
			</header>
			
<?php
		endif;
		
		if ( is_search() && ! have_posts() ) : ?>
			
			<header class="headline page-header">
				<div>
					<h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'writings' ); ?></h1>
				</div>
			</header>
			
<?php
		endif; ?>