<?php

// Define support links.
$general_questions_link = '<a href="https://wordpress.org/support/forum/how-to-and-troubleshooting/" target="_blank">' . esc_html__( 'forum', 'writings' ) . '</a>';
$customization_link = '<a href="https://wordpress.org/support/theme/writings/" target="_blank">' . esc_html__( 'Writings forum', 'writings' ) . '</a>';
$documentation_link = '<a href="http://docs.dinevthemes.com/writings-pro/" target="_blank">' . esc_html__( 'documentation', 'writings' ) . '</a>';
$review_link = '<a href="https://wordpress.org/support/theme/writings/reviews/#new-post" target="_blank">' . esc_html__( 'review', 'writings' ) . '</a>';
?>

<div class="tab-section">
    <h3 class="section-title"><?php esc_html_e( 'Looking for help?', 'writings' ); ?></h3>

    <p><?php esc_html_e( 'Is here collected some resources that you may find helpful:', 'writings' ); ?></p>

    <ul>
        <li>
        <?php
            /* translators: %s is a placeholder that will be replaced by a variable passed as an argument. */
            printf( esc_html__( 'If you have a general question related to WordPress, please post it on WordPress.org %s.', 'writings' ), $general_questions_link ); // WPCS: XSS OK.
        ?>
        </li>

        <li>
        <?php
            /* translators: %s is a placeholder that will be replaced by a variable passed as an argument. */
            printf( esc_html__( 'If you have a theme specific question, please post it on %s.', 'writings' ), $customization_link ); // WPCS: XSS OK.
        ?>
        </li>

        <li>
        <?php
            /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
            printf( esc_html__( 'Before panic, please visit our %s pages.', 'writings' ), $documentation_link ); // WPCS: XSS OK.
        ?>
        </li>
    </ul>

    <p>
	    <?php
            /* translators: %s is a placeholders that will be replaced by variables passed as an argument. */
            printf( esc_html__( 'If this theme is useful to you then leave your %s, please. Thank you!', 'writings' ), $review_link ); // WPCS: XSS OK.
        ?>
	</p>
</div><!-- .tab-section -->
