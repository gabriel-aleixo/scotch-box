<?php
/**
 * The front page template file
 *
 * If the user has selected a static page for their homepage, this is what will
 * appear.
 * Learn more: https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */

get_header();
?>

<?php
/**
 * Outputs css style for section of the frontpage
 */
function writings_element_style( $element ) {
	echo ' ' . writings_get_element_style( $element );
}
/**
 * Returns css style for section of the frontpage
 * getting value from customizer
 */
function writings_get_element_style( $element ) {

	$element = $element . '_margin';
	
	if ( writings( $element ) ) {

		// Get style from Customizer
		$style = 'style="margin-bottom: ' . esc_attr( writings( $element ) ) . 'px;"';

		// Apply filters for child theming
		$style = apply_filters( 'writings_get_element_style', $style );
		
		// Return style
		return $style;
	}
}
?>

	<div id="primary" class="front-page-content">
		<main id="main" class="site-main">
		
			<?php
			// Get elements from customizer
			$elements = writings_front_elements_positioning();

			// Loop through elements
			foreach ( $elements as $element ) {
				// Page Content
				if ( 'page_content' == $element ) {
			?>			
					<section id="front-page-content"<?php writings_element_style( $element ); ?>>
						<?php get_template_part( 'template-parts/front-page/content' ); ?>
					</section>
			<?php
				}
				// Blog Section
				if ( 'front_blog' == $element ) {
			?>
					<section id="front-recent-post" class="front-recent-post"<?php writings_element_style( $element ); ?>>
						<?php get_template_part( 'template-parts/front-page/recent-post' ); ?>
					</section>
			<?php
				}

			}
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();