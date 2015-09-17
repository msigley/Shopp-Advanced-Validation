<?php 
/*
Plugin Name: Shopp Advanced Validation
Plugin URI: http://github.com/msigley/
Description: Implements advanced email validation on the shopp checkout page.
Version: 1.3.1
Author: Matthew Sigley
Author URI: http://github.com/msigley/
License: GPLv3
*/
class ShoppAdvancedValidation {
	private static $object = null;
	private static $contruct_args = 
		array( 'mailgun_public_api_key', 
			'google_maps_js_api_browser_key', 
			'complexify_password_fields'
			);
	
	private $mailgun_public_api_key = false;
	private $complexify_password_fields = false;
	private $google_maps_js_api_browser_key = false;
	private $plugin_slug = null;
	
	public $url = null;
	public $path = null;
	
	private function __construct ( $args=array() ) {
		foreach( $args as $arg_name => $arg_value ) {
			if( !empty($arg_value) && in_array($arg_name, self::$contruct_args) )
				$this->$arg_name = $arg_value;
		}
		
		//Plugin slug for internal action and filter identification
		$this->plugin_slug = 'shopp_adv_valid';
		
		//Setup relative url
		$this->file = $file = basename(__FILE__);
		$this->directory = $directory = basename(dirname(__FILE__));
		$this->url = trailingslashit(WP_PLUGIN_URL.'/'.$this->directory);
		if ( is_ssl() ) $this->url = str_replace('http://','https://',$this->url);
		
		//Setup local filepath
		$this->path = plugin_dir_path(__FILE__);
		
		add_action( 'init', array( $this, 'register_css_js' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_css_js' ) );
	}
	
	static function &object( $args=array() ) {
		if ( ! self::$object instanceof ShoppAdvancedValidation ) {
			if( empty($args) ) return false;
			self::$object = new ShoppAdvancedValidation( $args );
		}
		return self::$object;
	}
	
	public function register_css_js () {
		//Use YYYYMMDD as version for ~24 hour brower caching.
		$version = date('Ymd', current_time('timestamp'));
		$protocol = 'http';
		if( is_ssl() )
			$protocol = 'https';
		
		//Mailgun Email Validator Scripts
		if( $this->mailgun_public_api_key ) {
			wp_register_script($this->plugin_slug.'_mailgun_validator', 
					$this->url.'js/mailgun_validator.js',
					array('jquery'),
					$version
					);	
			wp_register_script($this->plugin_slug.'_checkout_email', 
					$this->url.'js/checkout_email.js',
					array($this->plugin_slug.'_mailgun_validator'),
					$version
					);
			wp_localize_script($this->plugin_slug.'_checkout_email', 'shoppAdvValid', 
					array( 'mailgunPubKey' => $this->mailgun_public_api_key )
					);
		}

		//Complexify Password Strength Scripts
		if( $this->complexify_password_fields ) {
			wp_register_script($this->plugin_slug.'_complexify_banlist', 
					$this->url.'js/jquery.complexify.banlist.rot47.js',
					false,
					$version
					);
			wp_register_script($this->plugin_slug.'_complexify', 
					$this->url.'js/jquery.complexify.js',
					array('jquery', $this->plugin_slug.'_complexify_banlist'),
					$version
					);
			wp_register_script($this->plugin_slug.'_checkout_password', 
					$this->url.'js/checkout_password.js',
					array($this->plugin_slug.'_complexify'),
					$version
					);
		}

		//Address Autocomplete Scripts
		if( $this->google_maps_js_api_browser_key ) {
			wp_register_script($this->plugin_slug.'_autocomplete_lib',
					$protocol.'://maps.googleapis.com/maps/api/js?key='.$this->google_maps_js_api_browser_key.'&libraries=places',
					array('jquery')
					);
			wp_register_script($this->plugin_slug.'_address_autocomplete',
					$this->url.'js/autocomplete.js',
					array($this->plugin_slug.'_autocomplete_lib'),
					$version
					);
		}
	}
	
	public function enqueue_css_js () {
		if( is_checkout_page() || 
			( is_account_page() && 'profile' == ShoppStorefront()->account['request'] ) ) {
			if( $this->mailgun_public_api_key )
				wp_enqueue_script($this->plugin_slug.'_checkout_email');
			if( $this->complexify_password_fields )
				wp_enqueue_script($this->plugin_slug.'_checkout_password');
			if( $this->google_maps_js_api_browser_key )
				wp_enqueue_script($this->plugin_slug.'_address_autocomplete');
		}
	}
}

//Support for Constants in wp-config.php
if( defined('MAILGUN_PUBLIC_API_KEY') 
	|| defined('GOOGLE_MAPS_JS_API_BROWSER_KEY') 
	|| defined('COMPLEXIFY_PASSWORD_FIELDS') ) {
	$args = array(); 
	if( defined('MAILGUN_PUBLIC_API_KEY') )
		$args['mailgun_public_api_key'] = MAILGUN_PUBLIC_API_KEY;
	if( defined('GOOGLE_MAPS_JS_API_BROWSER_KEY') )
		$args['google_maps_js_api_browser_key'] = GOOGLE_API_BROWSER_KEY;
	if( defined('COMPLEXIFY_PASSWORD_FIELDS') )
		$args['complexify_password_fields'] = COMPLEXIFY_PASSWORD_FIELDS;
	$ShoppAdvancedValidation = ShoppAdvancedValidation::object( $args );
}
