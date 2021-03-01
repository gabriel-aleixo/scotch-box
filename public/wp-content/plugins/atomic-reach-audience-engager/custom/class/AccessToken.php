<?php

/**
 * Created by PhpStorm.
 * User: atomicreach
 * Date: 2/6/2018
 * Time: 2:20 PM
 */
class AccessToken
{

    /**
     * The user meta application password key.
     * @type string
     */
    const USERMETA_KEY_APPLICATION_PASSWORDS = '_accessToken';

    /**
     * The length of generated application passwords.
     *
     * @type integer
     */
    const PW_LENGTH = 24;

    /**
     * Add various hooks.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     */
    public static function add_hooks() {
        add_filter( 'script_loader_src', array( __CLASS__, 'add_cache_buster' ) );
        add_filter( 'style_loader_src', array( __CLASS__, 'add_cache_buster' ) );
        add_filter( 'authenticate',		array( __CLASS__, 'authenticate' ), 10, 3 );
        add_action( 'show_user_profile',	array( __CLASS__, 'show_user_profile' ) );
        add_action( 'edit_user_profile',	array( __CLASS__, 'show_user_profile' ) );
        add_action( 'rest_api_init',		array( __CLASS__, 'rest_api_init' ) );
        add_filter( 'determine_current_user',	array( __CLASS__, 'rest_api_auth_handler' ), 20 );
        add_filter( 'wp_rest_server_class',	array( __CLASS__, 'wp_rest_server_class' ) );
        self::fallback_populate_username_password();
    }

    /**
     * Add 'ar_ver' parameter to query string on files defined in
     * AR_NO_CACHE_FILES. Used to avoid browser caching.
     *
     * @since 6.0.8
     *
     * @access public
     * @static
     *
     * @param $src - Original JS/CSS file url
     *
     * @return string - File url with 'ar_ver' added on query string
     */
    public static function add_cache_buster($src) {
        $len = count(AR_NO_CACHE_FILES);
        for ($i=0; $i < $len ; $i++) {
            if (strpos($src, AR_NO_CACHE_FILES[$i]) !== false) {
                return add_query_arg('ar_ver', AR_VERSION, $src);
            }
        }
        return $src;
    }

    /**
     * Prevent caching of unauthenticated status.  See comment below.
     *
     * We don't actually care about the `wp_rest_server_class` filter, it just
     * happens right after the constant we do care about is defined.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     */
    public static function wp_rest_server_class( $class ) {
        global $current_user;
        if ( defined( 'REST_REQUEST' )
            && REST_REQUEST
            && $current_user instanceof WP_User
            && 0 === $current_user->ID ) {
            /*
             * For our authentication to work, we need to remove the cached lack
             * of a current user, so the next time it checks, we can detect that
             * this is a rest api request and allow our override to happen.  This
             * is because the constant is defined later than the first get current
             * user call may run.
             */
            $current_user = null;
        }
        return $class;
    }

    /**
     * Handle declaration of REST API endpoints.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     */
    public static function rest_api_init() {

        // List existing application passwords
        register_rest_route( 'AR/v1', '/atomicreach/(?P<user_id>[\d]+)', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => __CLASS__ . '::rest_list_application_passwords',
            'permission_callback' => __CLASS__ . '::rest_edit_user_callback',
        ) );

        // Add new application passwords
        register_rest_route( 'AR/v1', '/atomicreach/(?P<user_id>[\d]+)/add', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => __CLASS__ . '::rest_add_application_password',
            'permission_callback' => __CLASS__ . '::rest_edit_user_callback',
            'args' => array(
                'name' => array(
                    'required' => true,
                ),
            ),
        ) );

        // Delete an application password
        register_rest_route( 'AR/v1', '/atomicreach/(?P<user_id>[\d]+)/(?P<slug>[\da-fA-F]{12})', array(
            'methods' => WP_REST_Server::DELETABLE,
            'callback' => __CLASS__ . '::rest_delete_application_password',
            'permission_callback' => __CLASS__ . '::rest_edit_user_callback',
        ) );

        // Delete all application passwords for a given user
        register_rest_route( 'AR/v1', '/atomicreach/(?P<user_id>[\d]+)', array(
            'methods' => WP_REST_Server::DELETABLE,
            'callback' => __CLASS__ . '::rest_delete_all_application_passwords',
            'permission_callback' => __CLASS__ . '::rest_edit_user_callback',
        ) );

        // Some hosts that run PHP in FastCGI mode won't be given the Authentication header.
        register_rest_route( 'AR/v1', '/test-basic-authorization-header/', array(
            'methods' => WP_REST_Server::READABLE . ', ' . WP_REST_Server::CREATABLE,
            'callback' => __CLASS__ . '::rest_test_basic_authorization_header',
        ) );

        // Some hosts that run PHP in FastCGI mode won't be given the Authentication header.
        register_rest_route( 'AR/v1', '/get-all-posts/', array(
            'methods' => WP_REST_Server::READABLE ,
            'callback' => __CLASS__ . '::rest_get_all_posts',
            'permission_callback' => __CLASS__ . '::rest_edit_user_callback'
        ) );
    }

    /**
     * REST API endpoint to list existing application passwords for a user.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $data
     *
     * @return array
     */
    public static function rest_list_application_passwords( $data ) {
        $application_passwords = self::get_user_application_passwords( $data['user_id'] );
        $with_slugs = array();

        if ( $application_passwords ) {
            foreach ( $application_passwords as $item ) {
                $item['slug'] = self::password_unique_slug( $item );
                unset( $item['raw'] );
                unset( $item['password'] );

                $item['created'] = date( get_option( 'date_format', 'r' ), $item['created'] );

                if ( empty( $item['last_used'] ) ) {
                    $item['last_used'] =  '—';
                } else {
                    $item['last_used'] = date( get_option( 'date_format', 'r' ), $item['last_used'] );
                }

                if ( empty( $item['last_ip'] ) ) {
                    $item['last_ip'] =  '—';
                }

                $with_slugs[ $item['slug'] ] = $item;
            }
        }

        return $with_slugs;
    }

    /**
     * REST API endpoint to add a new application password for a user.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $data
     *
     * @return array
     */

    public static function rest_add_application_password( $data ) {

        list( $new_password, $new_item ) = self::create_new_application_password( $data['user_id'], $data['name'] );

        // Some tidying before we return it.
        $new_item['slug']      = self::password_unique_slug( $new_item );
        $new_item['created']   = date( get_option( 'date_format', 'r' ), $new_item['created'] );
        $new_item['last_used'] = '—';
        $new_item['last_ip']   = '—';
        unset( $new_item['password'] );

        return array(
            'row'      => $new_item,
            'password' => self::chunk_password( $new_password )
        );
    }

    /**
     * REST API endpoint to delete a given application password.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $data
     *
     * @return bool
     */
    public static function rest_delete_application_password( $data ) {
        return self::delete_application_password( $data['user_id'], $data['slug'] );
    }

    /**
     * REST API endpoint to delete all of a user's application passwords.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $data
     *
     * @return int The number of deleted passwords
     */
    public static function rest_delete_all_application_passwords( $data ) {
        return self::delete_all_application_passwords( $data['user_id'] );
    }

    /**
     * Whether or not the current user can edit the specified user.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $data
     *
     * @return bool
     */
    public static function rest_edit_user_callback( $data ) {
        return current_user_can( 'edit_user', $data['user_id'] );
    }

    /**
     * Loosely Based on https://github.com/WP-API/Basic-Auth/blob/master/basic-auth.php
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param $input_user
     *
     * @return WP_User|bool
     */
    public static function rest_api_auth_handler( $input_user ){

        // Don't authenticate twice
        if ( ! empty( $input_user ) ) {
            return $input_user;
        }

        // Check that we're trying to authenticate
        if ( ! isset( $_SERVER['PHP_AUTH_USER'] ) ) {
            return $input_user;
        }

        $user = self::authenticate( $input_user, $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] );

        if ( $user instanceof WP_User ) {
            return $user->ID;
        }

        // If it wasn't a user what got returned, just pass on what we had received originally.
        return $input_user;
    }

    /**
     * Test whether PHP can see Basic Authorization headers passed to the web server.
     *
     * @return WP_Error|array
     */
    public static function rest_test_basic_authorization_header() {
        $response = array();

        if ( isset( $_SERVER['PHP_AUTH_USER'] ) ) {
            $response['PHP_AUTH_USER'] = $_SERVER['PHP_AUTH_USER'];
        }

        if ( isset( $_SERVER['PHP_AUTH_PW'] ) ) {
            $response['PHP_AUTH_PW'] = $_SERVER['PHP_AUTH_PW'];
        }

        if ( empty( $response ) ) {
            return new WP_Error( 'no-credentials', __( 'No HTTP Basic Authorization credentials were found submitted with this request.' ), array( 'status' => 404 ) );
        }

        return $response;
    }


    /**
     * Test whether PHP can see Basic Authorization headers passed to the web server.
     *
     * @return WP_Error|array
     */
    public static function rest_get_all_posts(WP_REST_Request $request) {


        if(isset($request['per_page'])){
            $limit = $request['per_page'];
        }else{
            $limit = 10;
        }

        if(isset($request['offset'])){
            $offset = $request['offset'];
        }else{
            $offset = 0;
        }


        wp_reset_postdata();

        $args = array(
            'post_status' =>  array('publish','draft'),
            'posts_per_page' => $limit,
            'offset'           => $offset,
            'post_type'        => 'post',
            'orderby' => 'date',
            'order' => 'DESC',
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
            'suppress_filters' => true
        );

        $query = new WP_Query( $args ); // $query is the WP_Query Object
        $posts = $query->get_posts();   // $posts contains the post objects

        $output = array();

        foreach ( $posts as $post ) : setup_postdata( $post );

        $output[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'status' => $post->post_status,
                'content' => $post->post_content,
                'date' => $post->post_date,
                'post_url' =>$post->guid,
                'post_author' => get_the_author_meta('display_name', $post->post_author)
            );

        endforeach;


        return $output;
    }

    /**
     * Some servers running in CGI or FastCGI mode don't pass the Authorization
     * header on to WordPress.  If it's been rewritten to the `REMOTE_USER` header,
     * fill in the proper $_SERVER variables instead.
     */
    public static function fallback_populate_username_password() {
        // If we don't have anything to pull from, return early.
        if ( ! isset( $_SERVER['REMOTE_USER'] ) && ! isset( $_SERVER['REDIRECT_REMOTE_USER'] ) ) {
            return;
        }

        // If either PHP_AUTH key is already set, do nothing.
        if ( isset( $_SERVER['PHP_AUTH_USER'] ) || isset( $_SERVER['PHP_AUTH_PW'] ) ) {
            return;
        }

        // From our prior conditional, one of these must be set.
        $header = isset( $_SERVER['REMOTE_USER'] ) ? $_SERVER['REMOTE_USER'] : $_SERVER['REDIRECT_REMOTE_USER'];

        // Test to make sure the pattern matches expected.
        if ( ! preg_match( '%^Basic [a-z\d/+]*={0,2}$%i', $header ) ) {
            return;
        }

        // Removing `Bearer ` the token would start six characters in.
        $token               = substr( $header, 6 );
        $userpass            = base64_decode( $token );
        list( $user, $pass ) = explode( ':', $userpass );

        // Now shove them in the proper keys where we're expecting later on.
        $_SERVER['PHP_AUTH_USER'] = $user;
        $_SERVER['PHP_AUTH_PW']   = $pass;

        return array( $user, $pass );
    }

    /**
     * Filter the user to authenticate.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param WP_User $input_user User to authenticate.
     * @param string  $username   User login.
     * @param string  $password   User password.
     *
     * @return mixed
     */
    public static function authenticate( $input_user, $username, $password ) {
        $api_request = ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
        if ( ! apply_filters( 'application_password_is_api_request', $api_request ) ) {
            return $input_user;
        }

        $user = get_user_by( 'login',  $username );

        // If the login name is invalid, short circuit.
        if ( ! $user ) {
            return $input_user;
        }

        /*
         * Strip out anything non-alphanumeric. This is so passwords can be used with
         * or without spaces to indicate the groupings for readability.
         *
         * Generated application passwords are exclusively alphanumeric.
         */

//        error_log('username: '.$username);
//        error_log('PASSWORDs: '.$password);


//        $password = preg_replace( '/[^a-z\d]/i', '', $password );

        $hashed_passwords = get_user_meta( $user->ID, self::USERMETA_KEY_APPLICATION_PASSWORDS, true );

//        error_log('PASSWORDs: '.$hashed_passwords['password']);

        // If there aren't any, there's nothing to return.  Avoid the foreach.
        if ( empty( $hashed_passwords ) ) {
            return $input_user;
        }


        foreach ( $hashed_passwords as $key => $item ) {

            if($password == $hashed_passwords['password']){
                $item['last_used'] = time();
                $item['last_ip']   = $_SERVER['REMOTE_ADDR'];
                $hashed_passwords[ $key ] = $item;
                update_user_meta( $user->ID, self::USERMETA_KEY_APPLICATION_PASSWORDS, $hashed_passwords );
                return $user;
            }

//            if ( wp_check_password( $password, $hashed_passwords['password'], $user->ID ) ) {
//
//                $item['last_used'] = time();
//                $item['last_ip']   = $_SERVER['REMOTE_ADDR'];
//                $hashed_passwords[ $key ] = $item;
//                update_user_meta( $user->ID, self::USERMETA_KEY_APPLICATION_PASSWORDS, $hashed_passwords );
//                return $user;
//            }
        }

        // By default, return what we've been passed.
        return $input_user;
    }

    /**
     * Display the application password section in a users profile.
     *
     * This executes during the `show_user_security_settings` action.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param WP_User $user WP_User object of the logged-in user.
     */
    public static function show_user_profile( $user ) {
        wp_enqueue_script( 'server-check-js', plugin_dir_url( __FILE__ ) . '../js/server-checker.js', array() );
        wp_localize_script( 'server-check-js', 'appPass', array(
            'root'       => esc_url_raw( rest_url() ),
            'namespace'  => 'AR/v1',
            'nonce'      => wp_create_nonce( 'wp_rest' ),
            'user_id'    => $user->ID,
            'text'       => array(
                'no_credentials' => __( 'Due to a potential server misconfiguration, it seems that HTTP Basic Authorization may not work for the REST API on this site: `Authorization` headers are not being sent to WordPress by the web server. <a target="_blank" href="https://github.com/georgestephanis/application-passwords/wiki/Basic-Authorization-Header----Missing">You can learn more about this problem, and a possible solution, on our GitHub Wiki.</a>' ),
            ),
        ) );

    }

    /**
     * Generate a new application password.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param int    $user_id User ID.
     * @param string $name    Password name.
     * @return array          The first key in the array is the new password, the second is its row in the table.
     */
    public static function create_new_application_password( $user_id, $name ) {

        $new_password    = wp_generate_password( self::PW_LENGTH, false );
        $hashed_password = wp_hash_password( $new_password );

        $new_item = array(
            'name'      => $name,
            'password'  => $hashed_password,
            'created'   => time(),
            'last_used' => null,
            'last_ip'   => null,
        );

        $passwords = self::get_user_application_passwords( $user_id );

        if ( ! $passwords ) {
            $passwords = array();
        }

        $passwords[] = $new_item;
//        self::set_user_application_passwords( $user_id, $passwords );

        return array( $new_password, $new_item );
    }

    /**
     * Delete a specified application password.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @see Application_Passwords::password_unique_slug()
     *
     * @param int    $user_id User ID.
     * @param string $slug The generated slug of the password in question.
     * @return bool Whether the password was successfully found and deleted.
     */
    public static function delete_application_password( $user_id, $slug ) {
        $passwords = self::get_user_application_passwords( $user_id );

        foreach ( $passwords as $key => $item ) {
            if ( self::password_unique_slug( $item ) === $slug ) {
                unset( $passwords[ $key ] );
                self::set_user_application_passwords( $user_id, $passwords );
                return true;
            }
        }

        // Specified Application Password not found!
        return false;
    }

    /**
     * Deletes all application passwords for the given user.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param int    $user_id User ID.
     * @return int   The number of passwords that were deleted.
     */
    public static function delete_all_application_passwords( $user_id ) {
        $passwords = self::get_user_application_passwords( $user_id );

        if ( is_array( $passwords ) ) {
            self::set_user_application_passwords( $user_id, array() );
            return sizeof( $passwords );
        }

        return 0;
    }

    /**
     * Generate a unique repeateable slug from the hashed password, name, and when it was created.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param array $item The current item.
     * @return string
     */
    public static function password_unique_slug( $item ) {
        $concat = $item['name'] . '|' . $item['password'] . '|' . $item['created'];
        $hash   = md5( $concat );
        return substr( $hash, 0, 12 );
    }

    /**
     * Sanitize and then split a password into smaller chunks.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param string $raw_password Users raw password.
     * @return string
     */
    public static function chunk_password( $raw_password ) {
        $raw_password = preg_replace( '/[^a-z\d]/i', '', $raw_password );
        return trim( chunk_split( $raw_password, 4, ' ' ) );
    }

    /**
     * Get a users application passwords.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param int $user_id User ID.
     * @return array
     */
    public static function get_user_application_passwords( $user_id ) {
        $passwords = get_user_meta( $user_id, self::USERMETA_KEY_APPLICATION_PASSWORDS, false );
        if ( ! is_array( $passwords ) ) {
            return array();
        }
        return $passwords;
    }

    /**
     * Set a users application passwords.
     *
     * @since 0.1-dev
     *
     * @access public
     * @static
     *
     * @param int   $user_id User ID.
     * @param array $passwords Application passwords.
     *
     * @return bool
     */

    public static function set_user_application_passwords( $user_id, $passwords ) {
        return update_user_meta( $user_id, self::USERMETA_KEY_APPLICATION_PASSWORDS, $passwords );
    }

}
