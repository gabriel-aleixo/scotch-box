<?php
/**
 * Displays header site branding
 *
 * @package Writings
 */

?>

<div class="site-branding">

	<?php
			if ( has_custom_logo() ) {
					the_custom_logo();
			}
			
			if ( 1 != get_theme_mod( 'site_title_hide', 0 ) ) {
				if ( is_front_page() && is_home() ) :
				?>
					<span class="site-title"><?php bloginfo( 'name' ); ?></span>
	<?php
				else :
				?>
					<span class="site-title">
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
							<?php bloginfo( 'name' ); ?>
						</a>
					</span>
					
		<?php
				endif;
			} // site_title_hide
				
			$description = get_bloginfo( 'description', 'display' );
			
			if ( 1 != get_theme_mod( 'site_tagline_hide', 0 ) && ( $description || is_customize_preview() ) ) : ?>
				<span class="site-description"><?php echo $description; /* WPCS: xss ok. */ ?></span>
		<?php
			endif; ?>
</div><!-- .site-branding -->
