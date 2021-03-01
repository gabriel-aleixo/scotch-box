<?php

	/**
	 * Created by Hassan Zia.
	 * Date: 06/11/14
	 * Time: 11:09 AM
	 * Version: 0.2
	 */
	class Hatchbuck {

		static private $host = 'https://api.hatchbuck.com/api/v1/contact/';


		public function __construct() {
			// @todo
		}

		private static function _makeRequest( $url, $data_string ) {

			$ch = curl_init( $url );
			curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, "POST" );
			curl_setopt( $ch, CURLOPT_POSTFIELDS, $data_string );
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, TRUE );
			curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
					"Content-Type: application/json",
					"Content-Length: " . strlen( $data_string )
				)
			);

			# Removing this line will throw SSL verify error
			curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, FALSE );

			$result = curl_exec( $ch );

			if ( curl_errno( $ch ) ) {
				print curl_error( $ch );
			} else {
				curl_close( $ch );
			}

			return $result;

		}

//		Must provide apporpriate method and body data.
		private static function _doRequest( $method, $data, $service = '' ) {
			$url    = self::$host . $service . '?api_key=' . self::$key;
			$result = self::_makeRequest( $url, $data );

			return $result;
		}


		public static function search( $email ) {
			$n = '{"emails": [
            {   "address": "' . $email . '"    }

        ]}';

			return self::_doRequest( 'POST', $n, 'search' );
		}


		public static function addNewUser( $data ) {
			return self::_doRequest( 'POST', $data );
		}


		public static function addTag( $email, $d ) {
			$u    = $email . '/Tags';
			$data = '[' . $d . ']';

			return self::_doRequest( 'POST', $data, $u );
		}

		public static function delTag( $email, $d ) {
			$u    = $email . '/Tags';
			$data = '[' . $d . ']';

			return self::_doRequest( 'DELETE', $data, $u );
		}

		public static function updateUser( $data ) {
			return self::_doRequest( 'PUT', $data );
		}

		public static function startCampaign( $email, $data ) {
			$service = $email . '/Campaign';
			return self::_doRequest( 'POST', $data, $service );
		}
	}