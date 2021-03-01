<?php

if ( !class_exists( 'AR_Tracking' ) ) {
  class AR_Tracking {
    
    private $api_host;
     
    /**
     * Class constructor
     */
    function __construct($value) {
      
      $this->api_host = $value;
      
      //  check of date between currrent date and tracking date and
      //  if less or iqual 1 minute (for now to test) then will run the request to the oAuth service sending the data array then update the tracking date 
      $date_tracking_sent = get_option('aranalyzer_tracking_date'); // the date the tracking was installed

      $datef = time();
      $datei = $date_tracking_sent;

      // difference in days between two dates
      $diff = $this->get_time_diff($datei, $datef, 'd'); // get the time difference in days

      // To Test Tracking: without having to wait a minute
      if ($_GET['aranalyzerToRunTest']) {
        echo 'Test calling tracking service API ...<br>';
        $this->artracking();
      } else { 
        if ($diff >= 7) { // once a week will be sending the tracking
          $this->artracking();
          // update the tracking update date
          update_option('aranalyzer_tracking_date', $datef);               
        }
      }
    }

    /**
    * Main tracking function.
    */
    public function artracking() {
      
      require_once(MY_PLUGIN_FOLDER . '/includes/ARClient.php');

      // Start of Metrics
      global $blog_id, $wpdb, $current_user;
      

      $hash = get_option( 'AR_Tracking_Hash' );

      if ( !isset( $hash ) || !$hash || empty( $hash ) ) {
        $hash = md5( site_url() );
        update_option( 'AR_Tracking_Hash', $hash );
      }

      $pts = array();
      foreach ( get_post_types( array( 'public' => true ) ) as $pt ) {
        $count    = wp_count_posts( $pt );
        $pts[$pt] = $count->publish;
      }

      $comments_count = wp_count_comments();

      // wp_get_theme was introduced in 3.4, for compatibility with older versions, let's do a workaround for now.
      if ( function_exists( 'wp_get_theme' ) ) {
        $theme_data = wp_get_theme();
        $theme      = array(
          'name'       => $theme_data->display( 'Name', false, false ),
          'theme_uri'  => $theme_data->display( 'ThemeURI', false, false ),
          'version'    => $theme_data->display( 'Version', false, false ),
          'author'     => $theme_data->display( 'Author', false, false ),
          'author_uri' => $theme_data->display( 'AuthorURI', false, false ),
          'template' => $theme_data->display( 'Template', false, false ),
        );
      } else {
        $theme_data = (object) get_theme_data( get_stylesheet_directory() . '/style.css' );
        $theme      = array(
          'version'  => $theme_data->Version,
          'name'     => $theme_data->Name,
          'author'   => $theme_data->Author,
          'template' => $theme_data->Template,
          'theme_uri'  => $theme_data->URI,
          'author_uri'  => $theme_data->AuthorURI,
        );
      }

      $plugins = array();
      foreach ( get_option( 'active_plugins' ) as $plugin_path ) {
        if ( !function_exists( 'get_plugin_data' ) )
          require_once(ABSPATH . 'wp-admin/includes/admin.php');

        $plugin_info = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_path );

        $slug           = str_replace( '/' . basename( $plugin_path ), '', $plugin_path );
        $plugins[$slug] = array(
          'name'        => $plugin_info['Name'],
          'pluginURI '  => $plugin_info['PluginURI'],
          'version'     => $plugin_info['Version'],
          'description' => $plugin_info['Description'],
          'author'      => $plugin_info['AuthorName'],
          'authorURI '  => $plugin_info['AuthorURI'],
          'textDomain'  => $plugin_info['TextDomain'],
          'domainPath'  => $plugin_info['DomainPath'],
          'network'     => $plugin_info['Network'],
          'title'       => $plugin_info['Title'],
          'authorName'  => $plugin_info['AuthorName'],
        );
      }

      // errors
      $errors = self::get_errors();
      // user agent     
      $userAgentString = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : null;

      get_currentuserinfo();
      $uid = $current_user->ID;

      $data = array(
        'wordpressUserData' => array(
          'uri'       => site_url(),
          'hash'      => $hash,
          'version'   => get_bloginfo( 'version' ),
          'multisite' => is_multisite(),
          'users'     => $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->users INNER JOIN $wpdb->usermeta ON ({$wpdb->users}.ID = {$wpdb->usermeta}.user_id) WHERE 1 = 1 AND ( {$wpdb->usermeta}.meta_key = %s )", 'wp_' . $blog_id . '_capabilities' ) ),
          'lang'      => get_locale(),
        ),
        'wordpressTheme'    => $theme,
        'wordpressPlugin'   => $plugins,
        'wordpressTracking' => array(
          'wordpressUserId' => $uid,
          'browserAgent'    => $userAgentString,
          'errors'          => $errors,
        ),  
      );

      // Call the API with the post contents.
      $consumerKey = get_option('aranalyzer_consumerkey');
      $secretKey = get_option('aranalyzer_secretkey');

      $trackingData = json_encode(array("body" => $data));
      
      $host = $this->api_host;
      $apiClient = New AR_Client($host, $consumerKey, $secretKey);
      $apiClient->init();
      $result = $apiClient->trackWordpressData($trackingData);
  

      if($_GET['aranalyzerToRunTest']){
        echo 'Tracking sent results: ';
        print_r($result);

        print '<br>';
        print 'CONSUMER KEY: ' . $consumerKey;
        print '<br>';
        print_r(array('data' => $trackingData));
      }

    } // close fn artracking


    private function get_time_diff($di, $df, $type) {

      $subTime = $df - $di;
      $y = ($subTime/(60*60*24*365));
      $d = ($subTime/(60*60*24))%365;
      $h = ($subTime/(60*60))%24;
      $m = ($subTime/60)%60;           

      $time = $m;

      switch ($type){
        case 'd': 
          $time = $d;
          break;
        case 'h': 
          $time = $h;
          break;
      }

      return $time;
    } 


    static function get_errors() {

      $log_errors = ini_get( 'log_errors' ); // get the setting for display error from php
      $elogs      = array();
      $error_log  = ini_get( 'error_log' ); // get the php error logs file
      $logs       = array( $error_log );
      $count      = 200;
      $lines      = array();
      $line1       = array();

   
        
      foreach ( $logs as $log ) {
        if ( is_readable( $log ) ) {
         
          $aerrors = array_merge( $line1, self::last_lines( $log, $count ) ); // array with php log errors
          
          foreach($aerrors as $key => $value){
            
            $file1 = strpos($value, 'ar_analyzer.php');
            $file2 = strpos($value, 'ar_analyzer_admin.php.php');
            $file3 = strpos($value, 'ARTracking.php');
            $file4 = strpos($value, 'meta.php');
            $file5 = strpos($value, 'OAuth.php');
            $file6 = strpos($value, 'ClientOAuth.php');
            $file7 = strpos($value, 'ARClient.php');
            $file8 = strpos($value, 'class.apiClient.php');         
            
            if ($file1 || $file2 || $file3 || $file4 || $file5 || $file6 || $file7 || $file8 ) {
              $lines[] = $value;
            }
          } 
    
              
        }  
        
      }
     

      $lines = array_map( 'trim', $lines );
      $lines = array_filter( $lines );

      if ( empty( $lines ) ) {
        // If no errors found, force to return an empty array.
        $elogs = array();
        return $elogs;
      }

      foreach ( $lines as $key => $line ) {
        if ( false != strpos( $line, ']' ) )
          list( $time, $error ) = explode( ']', $line, 2 );
        else
          list( $time, $error ) = array( '', $line );

        $time        = trim( $time, '[]' );
        $error       = trim( $error );
        $lines[$key] = compact( 'time', 'error' );
      }

      if ( count( $error_log ) > 1 ) {
        uasort( $lines, array( __CLASS__, 'time_field_compare' ) );
        $lines = array_slice( $lines, 0, $count );
      }

      foreach ( $lines as $line ) {
        $error = esc_html( $line['error'] );
        $time  = esc_html( $line['time'] );

        $err_sent = false;
        $date_tracking_sent = strtotime(get_option('aranalyzer_tracking_date')); // the date the tracking was installed
        $date_error = strtotime($time);
        $will_be_send = ($date_error > $date_tracking_sent) ? true : false;
        $time_formated = date('Y-m-d H:i:s', $date_error);

        if ( ! empty( $error ) && $will_be_send) {
          $elogs[] = array( 
            'Time'  => $time_formated,
            'Error' => $error,
          );  
        }   
      }

      return $elogs;
    }      


    /**
    * Reads lines from end of file. Memory-safe.
    *
    * @link http://stackoverflow.com/questions/6451232/php-reading-large-files-from-end/6451391#6451391
    *
    * @param string  $path
    * @param integer $line_count
    * @param integer $block_size
    * 
    * @return array
    */
    static function last_lines( $path, $line_count, $block_size = 512 ) {
      $lines = array();

      // we will always have a fragment of a non-complete line
      // keep this in here till we have our next entire line.
      $leftover = '';

      $fh = fopen( $path, 'r' );
      // go to the end of the file
      fseek( $fh, 0, SEEK_END );

      do {
        // need to know whether we can actually go back
        // $block_size bytes
        $can_read = $block_size;

        if ( ftell( $fh ) <= $block_size )
          $can_read = ftell( $fh );

        if ( empty( $can_read ) )
          break;

        // go back as many bytes as we can
        // read them to $data and then move the file pointer
        // back to where we were.
        fseek( $fh, - $can_read, SEEK_CUR );
        $data  = fread( $fh, $can_read );
        $data .= $leftover;
        fseek( $fh, - $can_read, SEEK_CUR );

        // split lines by \n. Then reverse them,
        // now the last line is most likely not a complete
        // line which is why we do not directly add it, but
        // append it to the data read the next time.
        $split_data = array_reverse( explode( "\n", $data ) );
        $new_lines  = array_slice( $split_data, 0, - 1 );
        $lines      = array_merge( $lines, $new_lines );
        $leftover   = $split_data[count( $split_data ) - 1];
      } while ( count( $lines ) < $line_count && ftell( $fh ) != 0 );

      if ( ftell( $fh ) == 0 )
        $lines[] = $leftover;

      fclose( $fh );
      // Usually, we will read too many lines, correct that here.
      return array_slice( $lines, 0, $line_count );
    }

  } // close class

} // close if class exist           
