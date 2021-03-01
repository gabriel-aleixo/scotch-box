<?php
	/*
	  Plugin Name: Atomic Reach
	  Plugin URI: http://www.atomicreach.com
	  Description: Will help you integrate and optimize your News/Blog content with the Atomic Reach Platform
	  Version: 6.1.8
	  Author URI: http://www.atomicreach.com
	  Author: atomicreach
	 */

	defined( 'ABSPATH' ) || exit;
	/**
	 * Version is shown inside query string for JS/CSS file urls.
	 * Used to avoid browser cache.
	 */
	define('AR_VERSION', '6.1.8');
	/**
	 * Url query string of these files will contain 'ar_ver' parameter to avoid
	 * browser cache.
	 */
	define('AR_NO_CACHE_FILES', array(
		// PHP files
		'/includes/ARClient.php',
		// CSS files
		'classicEditor/css/inEditor.css',
		'src/assets/popover.css',
		'src/assets/sidebar.css',
		'classicEditor/css/metabox.css',
		'classicEditor/css/inEditor.css',
		// JS files
		'/includes/assets/ar_options_page.js',
		'build/index.js',
		'classicEditor/js/md5.js',
		'classicEditor/js/popoverLib.js',
		'classicEditor/js/paragraph-highlight.js',
		'classicEditor/js/word-highlight.js',
		'classicEditor/js/metabox.js',
		'classicEditor/js/library.js',
		'classicEditor/js/wp-request.js'
	));

	define( 'MY_WORDPRESS_FOLDER', $_SERVER['DOCUMENT_ROOT'] );
	define( 'MY_PLUGIN_FOLDER', str_replace( "\\", '/', dirname( __FILE__ ) ) );
	define( 'MY_PLUGIN_PATH', plugins_url( '/', __FILE__ ) );

	define( 'ATOMICREACH_NAMESPACE', 'atomicreach/v1' );

	require_once( dirname( __FILE__ ) . '/custom/class/AccessToken.php' );


	$accessToken = new AccessToken();
	$accessToken->add_hooks();

	define( 'API_HOST', 'https://app.atomicreach.com' ); // with SSL
	define( 'AR_URL', '//new.atomicreach.com' );
	define( 'AR_APP', '//new.atomicreach.com/' );


	// if( !class_exists( 'WP_Http' ) )
	// require_once( ABSPATH . WPINC . '/class-http.php' );


	add_action( 'admin_init', 'atomicreach_meta_box_init' );

	function atomicreach_meta_box_init() {

		wp_enqueue_script( 'lodash',
			MY_PLUGIN_PATH . 'classicEditor/js/lodash.js'
		);

		$isHighlightingEnabled = get_option( 'aranalyzer_isHighlightingEnabled');

		if ($isHighlightingEnabled && !atomicreach_is_gutenberg_active() ) {
			// Classic Editor is Active.
			$arg_post_types = array(
				'public'   => TRUE,
				'_builtin' => FALSE
			);
			$post_types     = get_post_types( $arg_post_types, 'names' );
			// add  post and pages as well.
			array_push( $post_types, 'post', 'page' );
			foreach ( $post_types as $type ) {
				add_meta_box(
					'atomicreach_metabox',
					'Atomic Reach',
					'atomicreach_metabox_setup',
					$type,
					'side',
					'high'
				);
			}
			// It cannot be added in atomicreach_metabox_setup function
			add_editor_style(  MY_PLUGIN_PATH . 'classicEditor/css/inEditor.css' );

		}
	}

	add_action( 'wp_enqueue_scripts', 'load_dashicons_front_end' );
	function load_dashicons_front_end() {
		wp_enqueue_style( 'dashicons' );
	}

	function atomicreach_metabox_setup(){
		if(!get_current_screen()->is_block_editor) {
			if ( isUserLoggedInToAtomicReach() ) {

				wp_enqueue_script(
					'atomicreach_tooltipsy_js',
					MY_PLUGIN_PATH . 'assets/tooltipsy.min.js'
				);

				wp_enqueue_script(
					'atomicreach_mark_js',
					MY_PLUGIN_PATH . 'assets/mark.es6.min.js'
				);

				wp_enqueue_script( 'wp-tinymce',
					'/wp-includes/js/wp-tinymce.js'
				);
				wp_enqueue_script( 'api-request',
					'/wp-includes/js/api-request.js'
				);

				wp_enqueue_script( 'wp-request',
					MY_PLUGIN_PATH . 'classicEditor/js/wp-request.js'
				);
				wp_enqueue_script(
					'atomicreach_ce_word-highlight',
					MY_PLUGIN_PATH . 'classicEditor/js/word-highlight.js'
				);
				wp_enqueue_script(
					'atomicreach_ce_paragraph-highlight',
					MY_PLUGIN_PATH . 'classicEditor/js/paragraph-highlight.js',
					array( 'jquery', 'wp-tinymce' )
				);
				wp_enqueue_script(
					'atomicreach_ce_library_js',
					MY_PLUGIN_PATH . 'classicEditor/js/library.js',
					array( 'lodash', 'jquery', 'wp-tinymce', 'wp-api' )
				);

				wp_enqueue_script(
					'atomicreach_ce_index_js',
					MY_PLUGIN_PATH . 'classicEditor/js/metabox.js',
					array( 'jquery', 'wp-tinymce', 'atomicreach_ce_word-highlight' )
				);
				wp_enqueue_script(
					'atomicreach_ce_popover_index_js',
					MY_PLUGIN_PATH . 'classicEditor/js/popoverLib.js',
					array( 'jquery', 'wp-tinymce' )
				);
				wp_enqueue_script(
					'atomicreach_ce_md5_js',
					MY_PLUGIN_PATH . 'classicEditor/js/md5.js',
					array( 'jquery' )
				);

				wp_enqueue_style(
					'atomicreach-ce-metabox-css',
					MY_PLUGIN_PATH . 'classicEditor/css/metabox.css'
				);

				$doc = new DOMDocument();
				$doc->loadHTMLFile( plugin_dir_path( __FILE__ ) . "classicEditor/ar_meta.html" );
				echo $doc->saveHTML();
			} else {
				$url = menu_page_url( 'ar-admin', FALSE );
				echo "<p><a href='{$url}'>Sign in</a></p>";

			}
		}
	}

	function atomicreach_gutenberg_enqueue() {

		$isHighlightingEnabled = get_option( 'aranalyzer_isHighlightingEnabled');

		if ($isHighlightingEnabled && isUserLoggedInToAtomicReach() ) {

			wp_enqueue_script(
				'atomicreach_index_js',
				MY_PLUGIN_PATH . 'build/index.js',
				array( 'wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-dom', 'lodash' )
			);

			wp_enqueue_script(
				'atomicreach_mark_js',
				MY_PLUGIN_PATH . 'assets/mark.es6.min.js'
			);

			wp_enqueue_style(
				'atomicreach-sidebar-css',
				MY_PLUGIN_PATH . 'src/assets/sidebar.css'
			);

			wp_enqueue_style(
				'atomicreach-popover-css',
				MY_PLUGIN_PATH . 'src/assets/popover.css'
			);

		}
	}

	add_action( 'enqueue_block_editor_assets', 'atomicreach_gutenberg_enqueue' );

	/**
	 * Check if Block Editor is active.
	 * Must only be used after plugins_loaded action is fired.
	 * https://wordpress.stackexchange.com/a/320654
	 * @return bool
	 */
	function atomicreach_is_gutenberg_active() {
		// Gutenberg plugin is installed and activated.
		$gutenberg = ! ( false === has_filter( 'replace_editor', 'gutenberg_init' ) );

		// Block editor since 5.0.
		$block_editor = version_compare( $GLOBALS['wp_version'], '5.0-beta', '>' );

		if ( ! $gutenberg && ! $block_editor ) {
			return false;
		}

		if ( atomicreach_is_classic_editor_plugin_active() ) {
			$editor_option       = get_option( 'classic-editor-replace' );
			$block_editor_active = array( 'no-replace', 'block' );

			return in_array( $editor_option, $block_editor_active, true );
		}

		//@todo: if user has classic editor plugin enabled but from the setting user decided to use block editor then the response becomes un-true.

		return true;
	}

	/**
	 * Check if Classic Editor plugin is active.
	 *
	 * @return bool
	 */
	function atomicreach_is_classic_editor_plugin_active() {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( is_plugin_active( 'classic-editor/classic-editor.php' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Stores track data on DB log. Executed on custom events like
	 * "optimization" button click.
	 */
	function logginCallBack($request) {
		require_once( MY_PLUGIN_FOLDER . '/includes/ARClient.php' );
		$parameters = $request->get_params();
		$jsonData = array_key_exists("jsonData", $parameters) ?
			$parameters["jsonData"] : array();
		$jsonData["timestamp"] = time();
		$parameters["jsonData"] = json_encode($jsonData);
		$consumerKey = get_option( 'aranalyzer_consumerkey' );
		$secretKey   = get_option( 'aranalyzer_secretkey' );
		$host      = API_HOST;
		$apiClient = New AR_Client( $host, $consumerKey, $secretKey );
		$apiClient->init();
		$response = $apiClient->doRequest( "/logging/log", $parameters );
		die($response ? json_encode($response) : array());
	}

	function createLogUniqueIdCallBack($request) {
		require_once( MY_PLUGIN_FOLDER . '/includes/ARClient.php' );
		$consumerKey = get_option( 'aranalyzer_consumerkey' );
		$secretKey   = get_option( 'aranalyzer_secretkey' );
		$host      = API_HOST;
		$apiClient = New AR_Client( $host, $consumerKey, $secretKey );
		$apiClient->init();
		$response = $apiClient->doRequest( "/logging/create-unique-id");
		die($response ? json_encode($response) : array());
	}

	/**
	 * Register REST API
	 * @todo: Move this into its own class.
	 */
	function atomicreach_register_rest_route() {

		// Get Profiles
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/get-profiles',
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => 'atomicreach_get_profiles',
			)
		);

		// One Click Optimize Feedback
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/optimize/article/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_optimize_article_feedback',
				'args'     => array(
					'profileId' => array(
						'required'          => TRUE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint'
					),
					'content'   => array(
						'required'          => FALSE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_string( $param );
						},
//						'sanitize_callback' => 'sanitize_textarea_field'
					),
				)
			)
		);

		//Task List Title Document Feedback
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/titleDocumentAnalyze/article/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_title_document_feedback',
				'args'     => array(
					'profileId' => array(
						'required'          => TRUE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint'
					),
					'content'   => array(
						'required'          => FALSE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_string( $param );
						},
//						'sanitize_callback' => 'sanitize_textarea_field'
					),
					'title'     => array(
						'required'          => FALSE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_string( $param );
						},
//						'sanitize_callback' => 'sanitize_title'
					),
				)
			)
		);


		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/paragraphAnalyze/article/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_paragraph_feedback',
				'args'     => array(
					'requestArray' => array(
						'required' => TRUE,
						/*'validate_callback' => function ( $param, $request, $key ) {
							return is_array($param);
						},*/
					),
				)
			)
		);

		//ATD INFO List
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/grammar/atd-info/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_get_atd_info',
				'args'     => array(
					'text' => array(
						'required' => TRUE,
					),
				)
			)
		);

		//Dictionary List
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/dictionary/add/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_dictionary_add',
				'args'     => array(
					'word' => array(
						'required' => TRUE,
					),
				)
			)
		);

		//Flag Word
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/optimize/flag/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_flag_word',
				'args'     => array(
					'originalWord'  => array(
						'required' => TRUE,
					),
					'replaceWord'   => array(
						'required' => TRUE,
					),
					'paragraphText' => array(
						'required' => TRUE,
					),
					'charIndex'     => array(
						'required' => TRUE,
					),
				)
			)
		);

		// One Click Optimize Feedback
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/optimize/article/',
			array(
				'methods'  => 'POST',
				'callback' => 'atomicreach_optimize_article_feedback',
				'args'     => array(
					'profileId' => array(
						'required'          => TRUE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint'
					),
					'content'   => array(
						'required'          => FALSE,
						'validate_callback' => function ( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				)
			)
		);

		// create unique id for track log
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/logging/createUniqueId/',
			array(
				'methods'  => 'GET',
				'callback' => 'createLogUniqueIdCallBack'
			)
		);

		// track log
		register_rest_route(
			ATOMICREACH_NAMESPACE,
			'/logging/log',
			array(
				'methods'  => 'POST',
				'callback' => 'logginCallBack',
				'args'     => array(
					'eventName'   => array(
						'required' => TRUE,
					),
					'appName' => array(
						'required' => TRUE,
					),
					'uniqueId' => array(
						'required' => TRUE,
					)
				)
			)
		);
	}


	add_action( 'rest_api_init', 'atomicreach_register_rest_route' );
	/**
	 * Get the ATomic Reach profiles
	 * @return $profiles JSON feed of returned objects
	 */
	function atomicreach_get_profiles() {

		require_once( MY_PLUGIN_FOLDER . '/includes/ARClient.php' );
		$consumerKey = get_option( 'aranalyzer_consumerkey' );
		$secretKey   = get_option( 'aranalyzer_secretkey' );

		$host      = API_HOST;
		$apiClient = New AR_Client( $host, $consumerKey, $secretKey );
		$apiClient->init();
		$profiles = $apiClient->doRequest( "/scoring-profile/getAllProfiles", array( "type" => "article" ) );
		if ( $profiles->status === 10 ) {
			$profilesFiltered = [];
			array_push( $profilesFiltered, array(
				"value"           => NULL,
				"label"           => "Select a profile",
				"bodyEngagement"  => "",
				"titleEngagement" => "",
			) );
			foreach ( $profiles->data as $profile ) {

				if ( $profile->status !== "active" ) {
					continue;
				}

				array_push( $profilesFiltered, array(
					"value"           => $profile->id,
					"label"           => $profile->name,
					"bodyEngagement"  => $profile->bodyEngagement,
					"titleEngagement" => $profile->titleEngagement
				) );
			}

			return new WP_REST_Response( $profilesFiltered, 200 );
		} else {
			return new WP_REST_Response("Atomicreach did not return data", 417);
		}

	}

	function atomicreach_get_atd_info( $request ) {


		$params = $request->get_params();
		$text   = $params["text"];

		$apiClient = initializeARClient();

		$results = $apiClient->doRequest( "/text-analyze-v2/getATDInfo", array( "text" => $text ) );
		if ( $results->status === 10 ) {

			return new WP_REST_Response( $results->data, 200 );
		} else {
			return new WP_REST_Response("Atomicreach did not return data", 417);
		}

	}

	function atomicreach_dictionary_add( $request ) {

		$params = $request->get_params();
		$word   = $params["word"];

		$apiClient = initializeARClient();

		$results = $apiClient->addDictionary( $word );

		if ( $results->status === 10 ) {
			return new WP_REST_Response( 200 );
		} else {
			return new WP_REST_Response( "Atomicreach did not return data", 417);
		}

	}

	function atomicreach_flag_word( $request ) {

		$params        = $request->get_params();
		$originalWord  = $params["originalWord"];
		$replaceWord   = $params["replaceWord"];
		$paragraphText = $params["paragraphText"];
		$charIndex     = $params["charIndex"];
		$feedBackType  = $params["feedBackType"];

		$apiClient = initializeARClient();

		$results = $apiClient->doRequest( "/text-feedback/replaceWord", array(
			"originalWord"  => $originalWord,
			"replaceWord"   => $replaceWord,
			"paragraphText" => $paragraphText,
			"charIndex"     => $charIndex,
			"feedBackType"  => $feedBackType,
		) );


		if ( $results->status === 10 ) {
			return new WP_REST_Response( 200 );
		} else {
			return new WP_REST_Response( "Atomicreach did not return data", 417 );
		}

	}

	function atomicreach_optimize_article_feedback( $request ) {

		$params      = $request->get_params();
		$contentHtml = $params["content"];
		$profileId   = $params["profileId"];

		$apiClient = initializeARClient();

		$feedback = $apiClient->doRequest( "/service/Optimize", array(
			"HTMLDocument" => $contentHtml,
			"profileId"    => $profileId,
		) );

		if ( $feedback->status === 10 ) {

			if(($feedback->data->http_code === 200)) {
				return new WP_REST_Response( $feedback->data->paragraphs, 200 );
			}

			if($feedback->data->http_code === 500){
				return new WP_REST_Response( $feedback, 417 );
			}else{
				return new WP_REST_Response("No result was provided", 200 );
			}
		} else {
			return new WP_REST_Response( $feedback, 417 );
		}

	}

	function atomicreach_title_document_feedback( $request ) {

		$params          = $request->get_params();
		$title           = $params["title"];
		$contentHtml     = $params["contentHtml"];
		$profileId       = $params["profileId"];
		$contentTypeName = "article";

		$apiClient = initializeARClient();

		$feedback = $apiClient->doRequest( "/text-analyze-v2/taskListTitleDocument", array(
			"title"           => $title,
			"contentHtml"     => $contentHtml,
			"profileId"       => $profileId,
			"contentTypeName" => $contentTypeName,
		) );


//		return new WP_REST_Response( $feedback, 200 );

		if ( $feedback->status === 10 ) {
			return new WP_REST_Response( $feedback, 200 );
		} else {
			return new WP_REST_Response( "Atomicreach '/text-analyze-v2/taskListTitleDocument' endpoint did not return expected data | " .
			                             json_encode( $feedback ), 417 );
		}

	}

	function atomicreach_paragraph_feedback( $request ) {

		$params       = $request->get_params();
		$requestArray = json_decode( $params["requestArray"] );

		$apiClient = initializeARClient();

		$feedback = $apiClient->doMultiRequest( "/text-analyze-v2/taskListParagraphForWordPress", $requestArray );

		return new WP_REST_Response( $feedback, 200 );

		if ( $feedback->status === 10 ) {
			return new WP_REST_Response( $feedback, 200 );
		} else {
			return new WP_REST_Response( "Atomicreach '/text-analyze-v2/taskListTitleDocument' endpoint did not return expected data", 417);
		}

	}




	function clearARMarkerTags( $block_content, $block ) {

		$resp = preg_replace( "/<\/?armarker(.*?)>/", "", $block_content );

		return ( is_null( $resp ) ? $block_content : $resp );
	}

	add_filter( 'render_block', 'clearARMarkerTags', 10, 2 );


	/*************************/
	/*    API Interaction    */
	/*************************/

	function atomicreach_admin() {
		//@todo: Revisit this method to ensure minimum redundancy.
		$current_user = wp_get_current_user();
		$accessToken = new AccessToken();
		$accessToken->show_user_profile( $current_user );

		require_once( 'ar_options_page.php' );

	}


	add_action( 'admin_menu', 'atomicreach_admin_actions' );

	function atomicreach_admin_actions() {

		$isHighlightingEnabled = get_option( 'aranalyzer_isHighlightingEnabled');
		$script_params = array(
			'isHighlightingEnabled' => ($isHighlightingEnabled === false) ? "0" : "1" ,
			'loggedIn' => isUserLoggedInToAtomicReach(),

		);
		// Javascript for admin page.
		wp_enqueue_script( 'ar_options_page_js', MY_PLUGIN_PATH . '/includes/assets/ar_options_page.js',
			['jquery']
		);
		wp_localize_script('ar_options_page_js','aranalyzer_params',$script_params);

		add_menu_page( "Atomic Reach Configuration", "Atomic Reach", "manage_options", "ar-admin", "atomicreach_admin",
			plugin_dir_url( __FILE__ ) . "custom/imgs/ar-logo-icon.png" );


	}


	/* hook when click on update */
//	add_action( 'publish_post', 'aranalyzer_review' );

	add_action( 'load-post.php', 'load_post' );

	function load_post($post_id)  {

		$message = (isset($_GET[ 'message' ]) ? true : false);

		print "<input id='post-status' type='hidden' value='$message' />";
	}


	function aranalyzer_review( $post_ID = 0 ) {
		if ( $post_ID == 0 ) {
			$post_ID = intval( $_POST['postID'] );
			$arajax  = 1;
		}

		// code by Sergio
		global $wp_version;
		if ( version_compare( $wp_version, '3.8', '<' ) ) {
			global $flag;
			if ( $flag != 1 ) {
				$flag = 1;

				return;
			}
		}
		// End Sergio Code
		// if (!session_id()) {
		// session_start();
		// }
		// Get post information
		$post_info = get_post( $post_ID );
		$title     = $post_info->post_title;

		/**
		 * We are removing the wptexturize before creating the content value to be send to api because it is changing single quotes
		 * with #8217 char and if makes the analysis fail.
		 *
		 * check
		 * http://codex.wordpress.org/Function_Reference/wptexturize
		 */
		remove_filter( 'the_content', 'wptexturize' );
		$content = apply_filters( 'the_content', $post_info->post_content );
		add_filter( 'the_content', 'wptexturize' );

		$ar_api_status = TRUE;
		$ar_api_error  = "";

		// Save the analizer is active option
		$meta_key = '_ar_meta_review_enabled';
		$value    = ( isset( $_POST[ $meta_key ] ) ? $_POST[ $meta_key ] : '' );
		delete_post_meta( $post_ID, $meta_key );
		add_post_meta( $post_ID, $meta_key, $value, TRUE );
		if ( $value === "enabled" ) {
			$analyzer_active = TRUE;
		}

		// Save the audience list option selected
		$meta_key  = '_ar_meta_audience_list';
		$segmentId = $value = ( isset( $_POST[ $meta_key ] ) ? $_POST[ $meta_key ] : '' );
		delete_post_meta( $post_ID, $meta_key );
		add_post_meta( $post_ID, $meta_key, $value, TRUE );

		if ( isset( $analyzer_active ) ) {
			if ( $analyzer_active ) {
				/* After a long time looking through formatting functions              *
				 * I found this combination that left HTML code without encoding and   *
				 * all the other text formatted with HTML entities encoding            */

				$title   = htmlspecialchars_decode( htmlentities( $title, ENT_NOQUOTES, 'UTF-8', FALSE ), ENT_NOQUOTES );
				$content = htmlspecialchars_decode( htmlentities( $content, ENT_NOQUOTES, 'UTF-8', FALSE ), ENT_NOQUOTES );
				// Call the API with the post contents.
				$consumerKey = get_option( 'aranalyzer_consumerkey' );
				$secretKey   = get_option( 'aranalyzer_secretkey' );
				$scoringObj  = aranalyzer_api_getmetadata( $consumerKey, $secretKey, $title, $content, $segmentId );

				if ( $arajax == 1 ) {
					echo $scoringObj;
				}

				// delete_post_meta($post_ID, '_ar_api_status');
				update_option( 'aranalyzer_state_keys', 'TRUE' );

				if ( isset( $scoringObj->error ) ) {
					// delete_post_meta($post_ID, '_ar_api_error');
					// add_post_meta($post_ID,'_ar_api_error', $scoringObj->error, TRUE);
					// add_post_meta($post_ID,'_ar_api_status', 'FALSE', TRUE);
					update_option( 'aranalyzer_state_keys', 'FALSE' );

					$_SESSION['_ar_api_error'] = $scoringObj->error;
				} else {

					$_SESSION['_ar_api_error'] = FALSE;

				}
			}
		}
	}


	/*********************/
	/* TinyMCE custom functions */
	/*********************/

	add_action( 'wp_ajax_awSignInEmail_ajax', 'awSignInEmail_ajax_callback' );

	function awSignInEmail_ajax_callback() {

		if ( isset( $_POST['email'] ) ) {
			$email = $_POST['email'];
		}
		if ( isset( $_POST['pass'] ) ) {
			$pass = $_POST['pass'];
		}

		if ( isset( $email ) && isset( $pass ) ) {


			$host = API_HOST;

			require_once( MY_PLUGIN_FOLDER . '/includes/ARClient.php' );

			$apiClient = new AR_Client( $host, '', '', $email, $pass );

			if ( $apiClient->key != "" && $apiClient->secret != "" ) {
//				die( json_encode( $apiClient) );

				$accessToken     = new AccessToken();
				$current_user    = wp_get_current_user();
				$data['user_id'] = $current_user->data->ID;
				$data['name']    = $current_user->data->user_login;
				$passwordData    = $accessToken->rest_add_application_password( $data );
				$accessToken->set_user_application_passwords( $data['user_id'], $passwordData );

				$apiClient->init();
				$apiClient->setAppName( "WP" );

				try {
					$apiClient->connectWordPress( $passwordData['password'], $data['name'], site_url() );
				} catch ( Exception $exception ) {

				}

				$result = $apiClient->getAtomicScore();
				update_option( 'aranalyzer_consumerkey', $apiClient->key );
				update_option( 'aranalyzer_secretkey', $apiClient->secret );
				update_option( 'aranalyzer_state_keys', 'TRUE' );

				die( json_encode( $result ) );

			} else {
				die( $apiClient->errorMessage );
			}
		} else {

			die( "error" );
		}


	}

	add_action('wp_ajax_update_editor_highlighting', 'atomicreach_update_editor_highlighting_callback');

	function atomicreach_update_editor_highlighting_callback(){
		if ( isset( $_POST['value'] ) ) {
			$value = $_POST['value'];
		}
		try{
			update_option( 'aranalyzer_isHighlightingEnabled', (int) $value );
		}catch (Exception $exception){
			die( json_encode( ['status'=>24] ) );

		}
		die( json_encode( ['status'=>10] ) );

	}

	add_action( 'wp_ajax_disconnect_ajax', 'atomicreach_disconnect_ajax_callback' );

	function atomicreach_disconnect_ajax_callback() {

		$apiClient = initializeARClient();
		$apiClient->setAppName( "WP" );
		$status = $apiClient->disconnectWordPress();

//		delete_option( 'aranalyzer_isHighlightingEnabled');
		delete_option( 'aranalyzer_tracking' );
		delete_option( 'aranalyzer_view' );
		delete_option( 'aranalyzer_RSS' );
		delete_option( 'aranalyzer_consumerkey' );
		delete_option( 'aranalyzer_secretkey' );
		delete_option( 'aranalyzer_state_keys' );
		delete_option( 'arActivatedDate' );
		delete_option( 'aranalyzer_create' );

		delete_option( 'aranalyzer_recommendation' );

		die( json_encode( $status ) );
	}


	function checkWorPressConnection() {

		$apiClient   = initializeARClient();
		$atomicScore = $apiClient->checkWordPressConnection();

		$output = $atomicScore;

		return $output;

	}


	// Add admin bar menu
	add_action( 'wp_before_admin_bar_render', 'aranalyzer_admin_bar_render' );

	function aranalyzer_admin_bar_render() {
		global $wp_admin_bar;
		// we can add a submenu item too
		$wp_admin_bar->add_menu( array(
			'parent' => '',
			'id'     => 'atomicreach',
			'title'  => __( '<img src="' . plugin_dir_url( __FILE__ ) . 'custom/imgs/ar-logo-icon.png"  style="vertical-align:middle;margin-right:5px"
			alt="Atomic Reach" title="Atomic Reach" />Atomic Reach' )
//			'href'   => 'http://www.atomicreach.com?utm_source=WP%20Plugin&utm_medium=' . get_option( 'home' ) . '&utm_campaign=WP%20PLUGIN%20ADMINBAR'
		) );


		$consumerkey = get_option( 'aranalyzer_consumerkey' );
		$secretkey   = get_option( 'aranalyzer_secretkey' );

		if ( ! empty( $consumerkey ) && ! empty( $secretkey ) ) {

			$createCount         = get_option( 'aranalyzer_create' );
			$recommendationCount = get_option( 'aranalyzer_recommendation' );
			//$performanceCount = get_option('aranalyzer_performance');

			$create          = AR_APP . 'wpRedirect.php?code=' . base64_encode( $consumerkey . '-' . $secretkey . '-' . 'create' ) . '&count=' . $createCount;
			$recommendations = AR_APP . 'wpRedirect.php?code=' . base64_encode( $consumerkey . '-' . $secretkey . '-' . 'recommendations' ) . '&count=' . $recommendationCount;
//            $performance = AR_APP.'wpRedirect.php?code='.base64_encode($consumerkey.'-'.$secretkey.'-'.'performance').'&count='.$performanceCount;
		} else {
			$create          = AR_APP . 'blogs/content';
			$recommendations = AR_APP . 'blogs/profiles';
//            $performance = AR_APP.'i/performance';
		}

		// overwrite so it does not redirects to wpRedirect.php
		$create          = AR_APP . 'blogs/content';
		$recommendations = AR_APP . 'blogs/profiles';

		$wp_admin_bar->add_menu( array(
			'parent' => 'atomicreach',
			'id'     => 'atomicreach1',
			'title'  => __( 'Optimize Posts' ),
			'href'   => $create,
			'meta'   => array(
				'title'  => __( 'Optimize Posts' ),
				'target' => '_blank',
				'class'  => 'ar_score'
			),
		) );


		$wp_admin_bar->add_menu( array(
			'parent' => 'atomicreach',
			'id'     => 'atomicreach2',
			'title'  => __( 'Create Profiles' ),
			'href'   => $recommendations,
			'meta'   => array(
				'title'  => __( 'Create Profiles' ),
				'target' => '_blank',
				'class'  => 'ar_contact_us'
			),
		) );


	}


	/*** EXTRA FEED ***/
	add_action( 'init', 'arfeed' );

	function arfeed() {
		$arRSS = get_option( 'aranalyzer_RSS' );
		if ( $arRSS == 1 ) {
			add_feed( 'arfeed', 'arcustomRSS' );
		}
	}

	function arcustomRSS() {
		$arRSS = get_option( 'aranalyzer_RSS' );
//		get_template_part('feed', 'two');

//		if ($arRSS == 1) {
		global $more;
		$more      = - 1;
		$postCount = 1500; // The number of posts to show in the feed
		$posts     = query_posts( 'showposts=' . $postCount );
		header( 'Content-Type: ' . feed_content_type( 'rss-http' ) . '; charset=' . get_option( 'blog_charset' ), TRUE );
		echo '<?xml version="1.0" encoding="' . get_option( 'blog_charset' ) . '"?' . '>' . PHP_EOL;
		echo '<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"' . PHP_EOL;
		do_action( 'rss2_ns' );
		echo '>' . PHP_EOL;
		echo '<channel>' . PHP_EOL;
		echo '<title>';
		bloginfo_rss( 'name' );
		echo ' - Feed</title>' . PHP_EOL;
		echo '<atom:link href="';
		self_link();
		echo '" rel="self" type="application/rss+xml" />' . PHP_EOL;
		echo '<link>';
		bloginfo_rss( 'url' );
		echo '</link>' . PHP_EOL;
		echo '<description>';
		bloginfo_rss( 'description' );
		echo '</description>' . PHP_EOL;
		echo '<lastBuildDate>' . mysql2date( 'D, d M Y H:i:s +0000', get_lastpostmodified( 'GMT' ), FALSE ) . '</lastBuildDate>' . PHP_EOL;
		echo '<language>' . get_option( 'rss_language' ) . '</language>' . PHP_EOL;
		echo '<sy:updatePeriod>' . apply_filters( 'rss_update_period', 'hourly' ) . '</sy:updatePeriod>' . PHP_EOL;
		echo '<sy:updateFrequency>' . apply_filters( 'rss_update_frequency', '1' ) . '</sy:updateFrequency>' . PHP_EOL;
		do_action( 'rss2_head' );
		while ( have_posts() ) : the_post();
			echo '<item>';
			echo '<title>';
			the_title_rss();
			echo '</title>' . PHP_EOL;
			echo '<link>';
			the_permalink_rss();
			echo '</link>' . PHP_EOL;
			echo '<pubDate>' . mysql2date( 'D, d M Y H:i:s +0000', get_post_time( 'Y-m-d H:i:s', TRUE ), FALSE ) . '</pubDate>' . PHP_EOL;
			echo '<dc:creator>';
			the_author();
			echo '</dc:creator>' . PHP_EOL;
			echo '<guid isPermaLink="false">';
			the_guid();
			echo '</guid>' . PHP_EOL;
			echo '<description><![CDATA[';
			the_content(); //the_excerpt_rss();
			echo ']]></description>' . PHP_EOL;
			echo '<content:encoded><![CDATA[';
			the_content();
			echo ']]></content:encoded>' . PHP_EOL;
			rss_enclosure();
			do_action( 'rss2_item' );
			echo '</item>' . PHP_EOL;
		endwhile;
		echo '</channel>' . PHP_EOL;
		echo '</rss>' . PHP_EOL;


//		}
	}


	// TOP banner
	//	add_action( 'admin_notices', 'atomicreach_admin_user_area_notice' );
	function atomicreach_admin_user_area_notice() {

		$screen = get_current_screen();

		if ( current_user_can( 'manage_options' ) && ! isUserLoggedInToAtomicReach() && $screen->id !== "toplevel_page_ar-admin" ) {
			// if user is not logged in - Walk them through to the sign up screen.


			echo ' <div id="aw-atomicAdminNotice" class="update-nag">
                 <img style="float: left;margin-right: 12px;" id="awLogoNoticeArea" src="' . plugin_dir_url( __FILE__ ) . 'custom/imgs/AW_logo_icon_80px.png" />
                 <h4 style="margin-top: 5px;">Let\'s setup AtomicReach plugin! <a href="' . admin_url( 'admin.php?page=ar-admin' ) . '">Click Here To Sign In</a>.</h4>
          </div>';


		}


	}


	register_activation_hook( __FILE__, 'atomicreach_activate' );
	add_action('admin_init', 'my_plugin_redirect');
	function atomicreach_activate() {
// custom feed
		add_option( 'aranalyzer_isHighlightingEnabled', 1);
		update_option( 'aranalyzer_RSS', 1 );
		update_option( 'aranalyzer_view', 1 );
		update_option( 'arActivatedDate', date( 'Y-m-d' ) );

		arfeed();
		flush_rewrite_rules();
		add_option('my_plugin_do_activation_redirect', true);
	}

	function my_plugin_redirect() {
		if (get_option('my_plugin_do_activation_redirect', false)) {
			delete_option('my_plugin_do_activation_redirect');
			exit( wp_redirect(admin_url( 'admin.php?page=ar-admin' )) );
		}
	}


	register_deactivation_hook( __FILE__, 'atomicreach_deactivation' );
	function atomicreach_deactivation() {
		flush_rewrite_rules();

		delete_option( 'aranalyzer_isHighlightingEnabled');
		delete_option( 'aranalyzer_tracking' );
		delete_option( 'aranalyzer_view' );
		delete_option( 'aranalyzer_RSS' );
		delete_option( 'aranalyzer_consumerkey' );
		delete_option( 'aranalyzer_secretkey' );
		delete_option( 'aranalyzer_state_keys' );
		delete_option( 'arActivatedDate' );
		delete_user_option( get_current_user_id(), 'arLastScoreDate' );
	}


	// Return number of days since user last score.
	function getDays( $activation = FALSE ) {
		$today          = date( 'Y-m-d' ); // Today's date
		$lastScoreDate  = get_user_option( 'arLastScoreDate' );
		$activationDate = get_option( 'arActivatedDate' );


		if ( $activation ) {
			if ( ! $activationDate ) {
				return FALSE;
			}
			$requestedDate = $activationDate;
		} else {
			if ( ! $lastScoreDate ) {
				return FALSE;
			} // return 0 if user never scored before.
			$requestedDate = $lastScoreDate;
		}

		$sec = strtotime( $today ) - strtotime( $requestedDate );

		return secondsToTime( $sec );
	}


	/**
	 * Convert number of seconds into hours, minutes and seconds
	 * and return an array containing those values
	 *
	 * @param integer $inputSeconds Number of seconds to parse
	 *
	 * @return array
	 */
	function secondsToTime( $inputSeconds ) {

		$secondsInAMinute = 60;
		$secondsInAnHour  = 60 * $secondsInAMinute;
		$secondsInADay    = 24 * $secondsInAnHour;

		// extract days
		$days = floor( $inputSeconds / $secondsInADay );

		// extract hours
		$hourSeconds = $inputSeconds % $secondsInADay;
		$hours       = floor( $hourSeconds / $secondsInAnHour );

		// extract minutes
		$minuteSeconds = $hourSeconds % $secondsInAnHour;
		$minutes       = floor( $minuteSeconds / $secondsInAMinute );

		// extract the remaining seconds
		$remainingSeconds = $minuteSeconds % $secondsInAMinute;
		$seconds          = ceil( $remainingSeconds );

		// return the final array
//		$obj = array(
//			'd' => (int) $days,
//			'h' => (int) $hours,
//			'm' => (int) $minutes,
//			's' => (int) $seconds,
//		);
//		return $obj;
		return $days;
	}

	function consoleLog( $msg, $var_export = FALSE, $print_r = FALSE ) {
		// Required: https://wordpress.org/plugins/blackbar/

		if ( is_plugin_active( "bugfu-console-debugger/bugfu-console-debugger.php" ) ) {

			if ( $var_export ) {
				BugFu::log( var_export( $msg, TRUE ) );
			} elseif ( $print_r ) {
				BugFu::log( print_r( $msg, TRUE ) );
			} else {
				BugFu::log( $msg );
			}


		}elseif ( is_plugin_active( "blackbar/blackbar.php" ) ) {

			if ( $var_export ) {
				apply_filters( 'console', var_export( $msg, TRUE ) );
			} elseif ( $print_r ) {
				apply_filters( 'console', print_r( $msg, TRUE ) );
			} else {
				apply_filters( 'console', $msg );
			}

		}

	}

	function isUserLoggedInToAtomicReach() {

		$consumerkey = get_option( 'aranalyzer_consumerkey' );
		$secretkey   = get_option( 'aranalyzer_secretkey' );

		if ( empty( $consumerkey ) && empty( $secretkey ) ) {
			return FALSE;
		} else {
			return TRUE;
		}

	}

	/**
	 * @return AR_Client
	 */
	function initializeARClient() {
		if ( ! class_exists( "AR_Client" ) ) {
			require_once( MY_PLUGIN_FOLDER . '/includes/ARClient.php' );
		}

		$consumerKey = get_option( 'aranalyzer_consumerkey' );
		$secretKey   = get_option( 'aranalyzer_secretkey' );

		$apiClient = New AR_Client( API_HOST, $consumerKey, $secretKey );
		$apiClient->init();
		$apiClient->setAppName( "WP" );

		return $apiClient;
	}


?>
