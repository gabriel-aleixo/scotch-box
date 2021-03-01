/**
 * This file adds some LIVE to the Theme Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and 
 * then make any necessary changes to the page using jQuery.
 */
( function( $ ) {

	//Update site color in real time...
	wp.customize( 'primary_color', function( value ) {
		value.bind( function( newval ) {
			$('body, mark, label, body a, .main-navigation a, .search-icon:before, .no-thumbnail .title, .no-thumbnail .sticky-post, .infinite-scroll #infinite-handle button:hover, .infinite-scroll #infinite-handle button:focus, blockquote p, .gallery-caption, input, select, textarea, h1, h2, h3, h4, h5, h6, .page-numbers a, .page-numbers span').css('color', newval );
		} );
	} );

	wp.customize( 'secondary_color', function( value ) {
		value.bind( function( newval ) {
			$('.entry-meta *, .entry-footer *, .comment-metadata time, .site-info, .site-info a, .meta-nav, .main-navigation .current-menu-item > a, .main-navigation .current-menu-ancestor > a, .wp-caption-text').css('color', newval );
		} );
	} );

	wp.customize( 'button_color', function( value ) {
		value.bind( function( newval ) {
			$('button, input[type="button"], input[type="submit"], .button, .page-numbers span.current, .social-navigation a:hover').css('background-color', newval );
			$('.social-navigation a').css('fill', newval );
			$('.page-numbers span.current').css('border-color', newval );
		} );
	} );

	wp.customize( 'additional_color', function( value ) {
		value.bind( function( newval ) {
			$('.no-thumbnail .overlay-wrap, .page-numbers a, .page-numbers span, tbody > tr:nth-child(odd), pre, .comment-reply-link, .edit-link, mark, ins, code, .social-navigation a').css('background-color', newval );
			$('.page-numbers a, .page-numbers span').css('border-color', newval );
		} );
	} );
	
} )( jQuery );