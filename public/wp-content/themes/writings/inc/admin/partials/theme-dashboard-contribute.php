<?php
// Define links.
$review_link = '<a href="https://wordpress.org/support/theme/writings/reviews/#new-post" target="_blank">' . esc_html__( 'review', 'writings' ) . '</a>';
$translate_link = '<a href="https://translate.wordpress.org/projects/wp-themes/writings/" target="_blank">' . esc_html__( 'translate', 'writings' ) . '</a>';
$theme_link = '<a href="http://dinevthemes.com/themes/writings-pro/" target="_blank">' . esc_html__( 'Writings Theme', 'writings' ) . '</a>';
?>

<div class="tab-section">
    <p><strong><?php esc_html_e( 'Do you like this Theme? There are ways in which you can your gratitude:', 'writings' ); ?></strong></p>
    <p>
	   <?php
            /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
            printf( esc_html__( 'I will appreciate if you find a few minutes and leave a five stars %s.', 'writings' ), $review_link ); // WPCS: XSS OK.
       ?>
	</p>
    <p>
    <?php
        /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
        printf( esc_html__( 'It would be great if you could share %s.', 'writings' ), $theme_link ); // WPCS: XSS OK.
       ?>
    </p>
    <p>
       <?php
            /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
            printf( esc_html__( 'Are you a blogger? I would be happy if you could write a blog post about %s.', 'writings' ), $theme_link ); // WPCS: XSS OK.
       ?>  
    </p>
    <p>
       <?php
            /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
            printf( esc_html__( 'Eventually, you can make a %s of this theme into your native language.', 'writings' ), $translate_link ); // WPCS: XSS OK.
       ?>
    </p>
</div><!-- .tab-section -->

<div class="tab-section action-section">
    <h3 class="section-title"><?php esc_html_e( 'Thanks so much! :)', 'writings' ); ?></h3>
</div><!-- .tab-section -->
