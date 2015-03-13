<?php 
/*
Plugin Name: Shopp Advanced Validation
Plugin URI: http://github.com/msigley/
Description: Implements advanced email validation on the shopp checkout page.
Version: 1.0.0
Author: Matthew Sigley
Author URI: http://github.com/msigley/
License: GPLv3
*/
class ShoppAdvancedValidation {
	private static $object = null;
	
	private $mailgun_public_api_key = null;
	
	function __construct () {
		foreach( $args as $arg_name => $arg_value ) {
			if( !empty($arg_value) && in_array($arg_name, self::$contruct_args) )
				$this->$arg_name = $arg_value;
		}
	}
	
	static function &object( $args=array() ) {
		if ( ! self::$object instanceof ShoppAdvancedValidation ) {
			if( empty($args) ) return false;
			self::$object = new ShoppAdvancedValidation( $args );
		}
		return self::$object;
	}
}

//Support for Constants in wp-config.php
if( defined('MAILGUN_PUBLIC_API_KEY') ) {
	$args = array( 'mailgun_public_api_key' => MAILGUN_PUBLIC_API_KEY );
	$ShoppAdvancedValidation = ShoppAdvancedValidation::object( $args );
}