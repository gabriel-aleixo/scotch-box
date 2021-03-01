<?php
/**
 * Template part for displaying the social links menu.
 * @package Writings
 */

?>
<?php
		if ( has_nav_menu( 'social' ) ) :
		?>
			<nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Social Links Menu', 'writings' ); ?>">
				<?php
					wp_nav_menu( array(
						'theme_location' => 'social',
						'menu_class'     => 'social-links-menu',
						'depth'          => 1,
						'link_before'    => '<span class="screen-reader-text">',
						'link_after'     => '</span>' . writings_get_svg( array( 'icon' => 'chain' ) ),
					) );
				?>
			</nav>
<?php
		endif;
		?>