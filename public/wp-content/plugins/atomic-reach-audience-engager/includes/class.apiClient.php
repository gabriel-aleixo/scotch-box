<?php

	require_once("OAuth.php");

	class apiClient{
		const STATUS_OK = 10;
		const STATUS_INTERNAL_ERROR = 20;
		const STATUS_INVALID_ACCESS_TOKEN = 21;
		const STATUS_THRESHOLD_EXCEEDED = 22;
		const STATUS_INVALID_ACTION = 23;
		const STATUS_INVALID_DATA = 24;
		
		var $host;
		var $key;
		var $secret;
		var $sig_method;
		//This is the URL that we use to request a new access token
		var $request_token_url;
		//After getting an access token we'll want to have the user authenicate 
		var $authorize_url;
		//this final call fetches an access token.
		var $access_token_url;

		public function __construct($apiHost, $key, $secret){
			
			$this->sig_method = new OAuthSignatureMethod_HMAC_SHA1();
			$this->host = $apiHost;
			$this->request_token_url = $this->host .'/oauth/request-token';
	 
			//After getting an access token we'll want to have the user authenicate 
			$this->authorize_url = $this->host .'/oauth/authorize';
	 
			//this final call fetches an access token.
			$this->access_token_url = $this->host .'/oauth/access-token';

			$this->key = $key;
			$this->secret = $secret;
			
		}
		
		private function _isSession(){
			$token = new OAuthConsumer($_SESSION['ar_oauth_token'], $_SESSION['ar_oauth_token_secret'], 0);
			return ((!is_null($token->key)) && $_SESSION['ar_oauth_token']!='' && isset($_SESSION['ar_oauth_token']));
		}
		
		public function closeSession(){
			session_start();
			$_SESSION['ar_oauth_token'] = '';
			$_SESSION['ar_oauth_token_secret']= '';
			return;
		}
		
		public function init(){
			session_start();
			//session_destroy();

			$test_consumer = new OAuthConsumer($this->key, $this->secret, NULL);	
			if(!$this->_isSession()){
				//Reset tokens
				$this->closeSession();
				
				//1) Get the request token
				$req_req = OAuthRequest::from_consumer_and_token($test_consumer, NULL, "GET", $this->request_token_url);
				$req_req->sign_request($this->sig_method, $test_consumer, NULL);
				$url_for_request_authorize = $req_req->to_url(). "\n";
				$output = $this->_getCurlResponse(null, $url_for_request_authorize, "GET");
				//var_dump($output);echo "<br><br>";
				parse_str($output, $oauth);
				$oauth_token = $oauth['oauth_token'];
				$oauth_token_secret = $oauth['oauth_token_secret'];
				// 2) Make the authorization
				$output = $this->_getCurlResponse(null, $this->authorize_url . "?oauth_token=".$oauth_token, "GET");
				//var_dump($output);echo "<br><br>";

				// 3) Get Access token
				$test_token = new OAuthConsumer($oauth_token, $oauth_token_secret);
				$acc_req = OAuthRequest::from_consumer_and_token($test_consumer, $test_token, "GET", $this->access_token_url, $params);
				$acc_req->sign_request($this->sig_method, $test_consumer, $test_token);
				$url_request_access_token = $acc_req->to_url();
				$output = $this->_getCurlResponse(null, $url_request_access_token, "GET");
				parse_str($output, $oauth);
				//var_dump($output);
				$_SESSION['ar_oauth_token'] = $oauth['oauth_token'];
				$_SESSION['ar_oauth_token_secret'] = $oauth['oauth_token_secret'];
				return array($oauth['oauth_token'], $oauth['oauth_token_secret']);			
			} 
			
		}
		
		public function doRequest($resource, $fields = array()){
			session_start();
			foreach ($fields as $key => $value) $fields[$key] = urlencode($value);
			$test_consumer = new OAuthConsumer($this->key, $this->secret, NULL);
			$token = new OAuthConsumer($_SESSION['ar_oauth_token'], $_SESSION['ar_oauth_token_secret'], 1);
			$endpoint = $this->host . $resource;
			$profileObj = OAuthRequest::from_consumer_and_token($test_consumer, $token, "POST", $endpoint, $fields);
			$profileObj->sign_request($this->sig_method, $test_consumer, $token);
			$toHeader = $profileObj->to_header();
			$r = $this->_getCurlResponse($toHeader, $endpoint, "POST", $fields);
			$json = json_decode($r);
			//If a token problem is detected - try to regenerate valids
			if($json->status == apiClient::STATUS_INVALID_ACCESS_TOKEN) $this->closeSession();
			return $r;
		}
		
		private function _getCurlResponse($toHeader, $url, $method = "POST", $fields = array()) {
			$ch = curl_init();
			$A_header[] = $toHeader;
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $A_header);
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
			if($method=="POST" OR $method=="PUT") { 
			   curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields, '', '&'));
			   curl_setopt($ch, CURLOPT_POST, true); 
			   curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);	  
			}
			$output = curl_exec($ch);
			curl_close($ch);
			return $output;
		}
	}

