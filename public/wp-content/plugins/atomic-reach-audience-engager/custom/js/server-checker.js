/* global appPass, console, wp */
(function($,appPass){


    var $serverText               = $( '.server-error' ),
        testBasicAuthUser         = Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ),
        testBasicAuthPassword     = Math.random().toString( 36 ).replace( /[^a-z]+/g, '' );

    $.ajax( {
        url:        appPass.root + appPass.namespace + '/test-basic-authorization-header',
        method:     'POST',
        beforeSend: function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'Basic ' + btoa( testBasicAuthUser + ':' + testBasicAuthPassword ) );
        },
        error:      function( jqXHR ) {
            if ( 404 === jqXHR.status ) {


                if ( response.PHP_AUTH_USER === testBasicAuthUser && response.PHP_AUTH_PW === testBasicAuthPassword ) {
                    // $serverText.html('<i class="fas fa-exclamation-triangle"></i> <b>'+appPass.text.no_credentials+'</b>')
                } else {
                    $serverText.html('<i class="fas fa-exclamation-triangle"></i> <b>'+appPass.text.no_credentials+'</b>')
                }
            }
        }
    } ).done( function( response ) {
        if ( response.PHP_AUTH_USER === testBasicAuthUser && response.PHP_AUTH_PW === testBasicAuthPassword ) {
            // $serverText.html('<i class="fa fa-exclamation-triangle"></i> <b>'+appPass.text.no_credentials+'</b>')
        } else {
            $serverText.html('<i class="fa fa-exclamation-triangle"></i> <b>'+appPass.text.no_credentials+'</b>')
            $serverText.show();
        }
    } );

})( jQuery, appPass );
