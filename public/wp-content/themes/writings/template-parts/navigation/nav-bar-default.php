<?php
/**
 * Template part for displaying main navigation menu
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Writings
 */

?>

<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<button id="menu-toggle" class="menu-toggle"><span class="btn-label screen-reader-text"><?php esc_html_e( 'Main Menu', 'writings' ); ?></span></button>
			<div id="site-header-menu" class="site-header-menu">
				<?php if ( has_nav_menu( 'primary' ) ) : ?>
						<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'writings' ); ?>">
							<?php
									wp_nav_menu( array(
										'theme_location' => 'primary',
										'menu_class'     => 'primary-menu',
									 ) );
							?>
						</nav>
				<?php endif; ?>
			</div>
<?php endif; ?>