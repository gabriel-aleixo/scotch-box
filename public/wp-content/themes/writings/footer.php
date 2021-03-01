<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Writings
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer wrap-inner">
		<div class="site-info">
			<span class="copywrite">&#169; <?php echo date_i18n( 'Y' ); ?></span>
			<?php get_template_part( 'template-parts/footer/credits' ); ?>
		</div>
			<?php get_template_part( 'template-parts/footer/social-links' ); ?>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
