<?php


/*flush_rewrite_rules();

delete_option( 'aranalyzer_tracking' );
delete_option( 'aranalyzer_view' );
delete_option( 'aranalyzer_RSS' );
delete_option( 'aranalyzer_consumerkey' );
delete_option( 'aranalyzer_secretkey' );
delete_option( 'aranalyzer_state_keys' );
delete_option( 'arActivatedDate' );
delete_user_option( get_current_user_id(), 'arLastScoreDate' );*/


    //print_r($accessToken->delete_all_application_passwords($data['userid']));




//
//    $accessToken = new AccessToken();
//
//    $current_user = wp_get_current_user();
//
//    $data['user_id'] = $current_user->data->ID;
//    $data['name'] = $current_user->data->user_login;
//
//
//    $passwordData = $accessToken->rest_add_application_password($data);

//    $accessToken->set_user_application_passwords($data['userid'],$passwordData);



//    $array = apply_filters( 'determine_current_user', $array );

//    $data['name'] = $current_user->data->user_login;

//$accessToken->authenticate( $current_user, $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] );

//    print_r('test test test test');

//    $data['userid'] = $current_user->data->ID;
//    $data['name'] = $current_user->data->user_login;
//
//    $passwordData = $accessToken->rest_add_application_password($data);
//

//    $accessToken->set_user_application_passwords($data['userid'],$passwordData);






//    update_option( 'aranalyzer_consumerkey', '' );
//    update_option( 'aranalyzer_RSS', '' );
//    update_option( 'aranalyzer_state_keys', '' );
//    update_option( 'aranalyzer_secretkey', '' );
//    update_option( 'aranalyzer_state_keys', '' );


//    delete_option( 'aranalyzer_tracking' );
//    delete_option( 'aranalyzer_view' );
//    delete_option( 'aranalyzer_RSS' );
//    delete_option( 'aranalyzer_consumerkey' );
//    delete_option( 'aranalyzer_secretkey' );
//    delete_option( 'aranalyzer_state_keys' );
//    delete_option( 'arActivatedDate' );



	//Normal page display
	$consumerkey = get_option('aranalyzer_consumerkey');
	$secretkey = get_option('aranalyzer_secretkey');
	$aranalyzer_state_keys = get_option('aranalyzer_state_keys');
//    echo get_option('aranalyzer_consumerkey');


//    echo get_option('aranalyzer_create');




    if((empty($consumerkey) || empty($secretkey)) || ($aranalyzer_state_keys === 'FALSE' || empty($aranalyzer_state_keys))){

        $accessToken = new AccessToken();
        $current_user = wp_get_current_user();
        $data['user_id'] = $current_user->data->ID;
        $data['name'] = $current_user->data->user_login;
        $passwordData = $accessToken->rest_add_application_password($data);
        $accessToken->set_user_application_passwords($data['user_id'],$passwordData);



    }else{


        $returnData = checkWorPressConnection();

        if($returnData->status != 10){

            $accessToken = new AccessToken();
            $current_user = wp_get_current_user();
            $data['user_id'] = $current_user->data->ID;
            $data['name'] = $current_user->data->user_login;
            $passwordData = $accessToken->rest_add_application_password($data);
            $accessToken->set_user_application_passwords($data['user_id'],$passwordData);

            delete_option( 'aranalyzer_tracking' );
            delete_option( 'aranalyzer_view' );
            delete_option( 'aranalyzer_RSS' );
            delete_option( 'aranalyzer_consumerkey' );
            delete_option( 'aranalyzer_secretkey' );
            delete_option( 'aranalyzer_state_keys' );
            delete_option( 'arActivatedDate' );
            delete_option( 'arActivatedDate' );
            delete_option( 'arActivatedDate' );
            delete_option( 'aranalyzer_create');
//            delete_option( 'aranalyzer_performance');
            delete_option( 'aranalyzer_recommendation');
        }
    }


	if (isset($_POST['aranalyzer_saved']))
	if ($_POST['aranalyzer_saved'] == 'Y') {

		if (empty($consumerkey) && empty($secretkey)) {

			$tracking = $_POST['aranalyzer_tracking'];
			$arView   = $_POST['aranalyzer_view'];
			$arRSS    = $_POST['aranalyzer_RSS'];


			update_option('aranalyzer_view', $arView);
			update_option('aranalyzer_RSS', $arRSS);
			update_option('aranalyzer_tracking', $tracking);

			$date = current_time('mysql');
			update_option('aranalyzer_tracking_date', $date);

			?>
			<div class="error"><p><strong><?php _e('The consumer and secret keys are wrong, please get them first before continue.'); ?></strong></p>
			</div>
		<?php

		} else {
			$tracking = $_POST['aranalyzer_tracking'];
			$arView   = $_POST['aranalyzer_view'];
			$arRSS    = $_POST['aranalyzer_RSS'];


			update_option('aranalyzer_view', $arView);
			update_option('aranalyzer_RSS', $arRSS);
			update_option('aranalyzer_tracking', $tracking);

			$date = current_time('mysql');
			update_option('aranalyzer_tracking_date', $date);

			?>
			<div class="updated"><p><strong><?php _e('Options saved.'); ?></strong></p></div>
		<?php
		}
		if ($_POST['aranalyzer_RSS'] == 1)
			flush_rewrite_rules();
	} else {
		$tracking = get_option('aranalyzer_tracking');
		$arView   = get_option('aranalyzer_view');
		$arRSS    = get_option('aranalyzer_RSS');
	}
?>

<div class="wrap">
	<?php echo "<h2>" . __('Atomic Reach Integration', 'aranalyzer_trdom') . "</h2>"; ?>

	<form id='hb-form' class='jotform-form' name='form_43305729254' id='43305729254' method="post" action="<?php echo str_replace('%7E', '~', $_SERVER['REQUEST_URI']); ?>">
		<input type="hidden" name="aranalyzer_saved" value="Y">
		<div id="ar-btns-state">


            <p>Blog and News content optimized in Atomic Reach and seamlessly passed through to WordPress.</p>

            <p class="server-error" style="display: none;">

            </p>

			<?php if ((empty($consumerkey) || empty($secretkey)) || ($aranalyzer_state_keys === 'FALSE' || empty($aranalyzer_state_keys))): ?>
                <?php if(get_bloginfo('version') < 4.6 ){ ?>
                    <p>
                        Upgrade your WordPress Site to use this plugin
                    </p>

                <?php }else{ ?>
                <p>
                    <button class="button button-primary atomic-connect">
                        Integrate Atomic Reach
                        <img style="position: relative;top: 3px;left: 3px;" src="<?php echo plugins_url('/', __FILE__); ?>custom/imgs/ar-logo-icon.png"/>
                    </button>
                </p>

                <?php } ?>

			<?php else: ?>

                <?php if($returnData->status == 10): ?>

                    <?php

                        $createCount = get_option('aranalyzer_create');
                        $recommendationCount = get_option('aranalyzer_recommendation');
                        /*$performanceCount = get_option('aranalyzer_performance');*/

                        $create = AR_APP.'wpRedirect.php?code='.base64_encode($consumerkey.'-'.$secretkey.'-'.'create').'&count='.$createCount;
                        $recommendation = AR_APP.'wpRedirect.php?code='.base64_encode($consumerkey.'-'.$secretkey.'-'.'recommendations').'&count='.$recommendationCount;
                        /*$performance = AR_APP.'wpRedirect.php?code='.base64_encode($consumerkey.'-'.$secretkey.'-'.'performance').'&count='.$performanceCount;*/

                    ?>

                    <div class="disconnect-atomic-container">

                        <p><b>Whether it's more traffic or higher content conversions, you can create countless profiles to produce more engaging content for your audience</b></p>
                        <p><b>Then optimize all your WordPress posts in Atomic Reach and seamlessly pass your edits through to WordPress.</b></p>

                        <span class="button button-secondary atomic-disconnect">
                            Disconnect Atomic Reach  <i class="fa fa-times"></i>
                        </span>

                    </div>

                <?php else: ?>

                    <p class="atomic-container">
                        <button class="button button-primary atomic-connect">
                            Integrate Atomic Reach
                            <img style="position: relative;top: 3px;left: 3px;" src="<?php echo plugins_url('/', __FILE__); ?>custom/imgs/ar-logo-icon.png"/>
                        </button>
                    </p>

                <?php endif; ?>

            <?php endif; ?>
		</div>


<!---->
<!--		<h3>Tracking.</h3>-->
<!---->
<!--		<p><input name="aranalyzer_tracking" type="checkbox" value="1" --><?php //checked($tracking, 1); ?><!-- />-->
<!---->
<!--			--><?php //_e("Allow tracking of this Wordpress installs anonymous data."); ?><!--</p>-->
<!---->
<!--		<h3>View:</h3>-->
<!---->
<!--		<p><input name="aranalyzer_view" type="checkbox" value="1" --><?php //checked($arView, 1); ?><!-- />-->
<!--			--><?php //_e("Use modern view."); ?>
<!--		</p>-->
<!---->
<!--		<h3>RSS:</h3>-->
<!---->
<!--		<p><input name="aranalyzer_RSS" type="checkbox" value="1" --><?php //checked($arRSS, 1); ?><!-- />-->
<!--			--><?php //_e("Enable the special RSS link with full content."); ?>
<!--			<br>-->
<!--			<small>Copy and paste this RSS link in your Atomic Insights account so that the platform can collect data about your audience(s).</small>-->
<!--			<code>--><?php //bloginfo('url'); ?><!--/feed/arfeed/</code>-->
<!--		</p>-->
<!---->
<!--		<p class="submit">-->
<!--			<input class="button button-primary" type="submit" name="Submit" value="--><?php //_e('Update Options', 'aranalyzer_trdom') ?><!--"/>-->
<!--		</p>-->
	</form>

</div><!-- end wrap -->
<?php
	$qry = get_site_url();
	//VuVS Y23g PxlC R35d bbjV Qhtu
?>


<?php if ((empty($consumerkey) || $returnData->status != 10 || empty($secretkey)) || ($aranalyzer_state_keys === 'FALSE' || empty($aranalyzer_state_keys))): ?>



    <!-- modal content -->
    <div id="mw-modal-content">
        <div class="close"><a id="close-modal" href="<?php echo $qry; ?>" class="simplemodal-close">x</a></div>
        <div id="mw-modal-data">
            <?php


            //        require_once(dirname(__FILE__) . '/custom/class/AccessToken.php');

            $qry .= '/wp-admin/admin.php?page=ar-analyzer-admin&'.'mode=ar_callback';
            $qry = urlencode($qry);
            $cbUrl = AR_URL.'/account/remote-login?callback='.$qry;


            $cbUrl = $cbUrl."&wordpressUserName=".urlencode($data['name'])."&siteurl=".urlencode(get_site_url())."&accessToken=".urlencode($passwordData['password']);

            ?>

            <iframe id="AtomicReachLogin" src="<?php echo $cbUrl; ?>" width="800" height="415" scrolling="no"></iframe>
        </div>
    </div>

<?php endif; ?>
