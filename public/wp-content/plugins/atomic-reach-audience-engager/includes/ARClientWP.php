<?php
if( !class_exists( 'WP_Http' ) )
  include_once( ABSPATH . WPINC . '/class-http.php' );
  
require_once("ARClient.php");

class AR_ClientWP extends AR_Client {
  
  public function init(){
    parent::init();
   }  
  
  /** 
   *  Does the service request for the API
   *  $service: service controller/action (ie: 'api/echo')
   *  $data: post parameters
   *  Returns json object
   **/
  public function doRequest($service, $data = array()) {
    foreach ($data as $key => $value) $data[$key] = urlencode($value);
    $test_consumer = new ClientOAuthConsumer($this->key, $this->secret, NULL);
    $token = new ClientOAuthConsumer($_SESSION['ar_oauth_token'], $_SESSION['ar_oauth_token_secret'], 1);
    $endpoint = $this->host . $service;
    $profileObj = ClientOAuthRequest::from_consumer_and_token($test_consumer, $token, "POST", $endpoint, $data);
    $profileObj->sign_request($this->sig_method, $test_consumer, $token);
    $toHeader = $profileObj->to_header();
    $r = $this->_getCurlResponse($toHeader, $endpoint, "POST", $data);
    $json = json_decode($r);
    //If a token problem is detected - try to regenerate valids
    if($json->status == AR_Client::STATUS_INVALID_ACCESS_TOKEN) $this->closeSession();
    return $json;
  }

  /* rewrite method in case the server has not curl installed */
  private function _getCurlResponse($toHeader, $url, $method = "POST", $data = array()) {
    
    $A_header[] = $toHeader;
        
    if ($this->_iscurlinstalled()){
      $ch = curl_init();
      // $A_header[] = $toHeader;
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $A_header);
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
      if($method=="POST" OR $method=="PUT") { 
         curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
         curl_setopt($ch, CURLOPT_POST, true); 
         curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);    
      }
      $output = curl_exec($ch);
      curl_close($ch);
      return $output;
      
    }else{
      $request = new WP_Http;
      $result = $request->request($url, array( 'method' => $method, 'headers' => $A_header, 'body' => $data, 'sslverify' => false) );

      $result_metadata = "";
      if ($result['response']['code'] == 200) {
        $result_metadata = $result['body'];
      }
      
      return $result_metadata;      
    }
  
  }

  // ### Checks for presence of the cURL extension.
  private function _iscurlinstalled() {
    
      if  (in_array  ('curl', get_loaded_extensions())) {
          return true;
      }else{
          return false;
      }
      
      return false;
      
  }

  
}