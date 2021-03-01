<div id="AW-notLoggedIn">
    <div id="aw-signIn">

        <?php
        $consumerkey            = get_option( 'aranalyzer_consumerkey' );
        $secretkey              = get_option( 'aranalyzer_secretkey' );


        $createCount = get_option('aranalyzer_create');


        $create = AR_APP.'wpRedirect.php?code='.base64_encode($consumerkey.'-'.$secretkey.'-'.'create').'&count='.$createCount;


        ?>
        <div>
            <div class="create-link">Go to the <a target="_blank" href="<?php echo $create ?>">Atomic Reach</a> to Optimize your content</div>
        </div>
    </div>

    <div id="aw-signUp" style="display: none">
        <form id="aw-signUpForm">
            <h2>Sign Up </h2>
            <input class="guestInput" id="aw-signUpEmail" type="email" placeholder="Enter Your Email Address" autocomplete="off"/>
            <input class="guestInput" id="aw-signUpPassword" type="password" placeholder="Type Your Password" autocomplete="off"/>
            <input class="guestInput" id="aw-signUpPasswordReType" type="password" placeholder="Re-type Your Password" autocomplete="off" />
            <br />
            <label style="margin-left: 42px;">
                <input type="checkbox" id="tos" value="1"/>
                I agree to <a href="https://www.atomicreach.com/terms-of-use/" target="_blank">Terms of Use</a>:* </label>
            <br />
            <label style="margin-left: 42px;text-align: justify;width: 175px !important;display: inline-block;">
                <input type="checkbox" id="awRecNnewsletter" value="1"/>
                Receive Product Updates</label>
            <br />
            <button class="AWguestSubmitBtn btn" type="submit" id="aw-signUpFormSubmit"> Sign Up <i style="display: none;" class="awloadingIcon fa fa-circle-o-notch fa-spin"></i></button>
            <a style="cursor: pointer" id="aw-goTosignInForm"><span class="dashicons dashicons-arrow-left-alt2"></span> Go Back</a>
        </form>
    </div>
    <p id="aw-API-Error" style="color: #ff0000;"></p>
    <a href="" id="ar-thankyou" style="display: none;" target="_blank"></a>
</div>
<div id="AW-StandBy" style="display: none;">
</div>
