<?php
/**
 * Template part for displaying the Theme credits.
 * @package Writings
 */
?>

<?php
/* Translators: $s = name of the theme */
printf( esc_html_x( '%s Theme. ', 'Translators: $s = name of the theme', 'writings' ), '<a href="http://dinevthemes.com/themes/writings-pro/">' . esc_html__( 'Writings', 'writings' ) . '</a>' );
/* Translators: $s = name of the website CMS */
printf( esc_html_x( 'Powered by %s.', 'Translators: $s = name of website CMS', 'writings' ), '<a href="https://wordpress.org">' . esc_html__( 'WordPress', 'writings' ) . '</a>' );
?>