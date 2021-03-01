<?php
	/**
	 * Created by PhpStorm.
	 * User: syed_
	 * Date: 2019-08-28
	 * Time: 12:00 PM
	 */

	$ar_consumer_key = get_option( 'aranalyzer_consumerkey' );
	$ar_secret_key   = get_option( 'aranalyzer_secretkey' );
	$ar_state_keys   = get_option( 'aranalyzer_state_keys' );

	// If this file is called directly, abort.
	if ( ! defined( 'WPINC' ) ) {
		die;
	}

	if ( !$ar_consumer_key && !$ar_secret_key ) {
		// Not Logged In!
		renderLoginForm();
	} else {
		renderLoggedInView();
	}


	function renderLoginForm(){
	    include('login.html');
    }

	function renderLoggedInView(){
        include('logout.html');
    }
