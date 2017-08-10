<?php 
/*
Plugin Name: Shopp Advanced Validation
Plugin URI: http://github.com/msigley/
Description: Implements advanced email validation on the shopp checkout page.
Version: 1.4.0
Author: Matthew Sigley
Author URI: http://github.com/msigley/
License: GPLv3
*/
require_once( 'lib/mailcheck.php' );

class ShoppAdvancedValidation {
	private static $object = null;
	private static $mailcheck = null;
	private static $contruct_args = 
		array( 'customer_email_validation', 
			'google_maps_js_api_browser_key', 
			'complexify_password_fields',
			'customer_lookup'
			);
	
	private $customer_email_validation = false;
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
		add_action( 'wp_ajax_customer_email_lookup', array($this, 'customer_email_lookup') );
		add_action( 'wp_ajax_nopriv_customer_email_lookup', array($this, 'customer_email_lookup') );
		add_action( 'wp_ajax_customer_email_validation', array($this, 'customer_email_validation') );
		add_action( 'wp_ajax_nopriv_customer_email_validation', array($this, 'customer_email_validation') );
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
		
		//Shopp Customer Lookup
		if( $this->customer_lookup ) {
			wp_register_script($this->plugin_slug.'_customer_lookup', 
					$this->url.'js/jquery.customer_lookup.js',
					array('jquery'),
					$version);
		}

		//Shopp Customer Email Validation Scripts
		if( $this->customer_email_validation ) {
			$depends = array('jquery');
			if( $this->customer_lookup )
				$depends[] = $this->plugin_slug.'_customer_lookup';
			wp_register_script($this->plugin_slug.'_email_validator', 
					$this->url.'js/email_validator.js',
					$depends,
					$version
					);	
			wp_register_script($this->plugin_slug.'_checkout_email', 
					$this->url.'js/checkout_email.js',
					array($this->plugin_slug.'_email_validator'),
					$version
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
		
		wp_register_style($this->plugin_slug.'_advanced_validation_css',
			$this->url.'shopp-advanced-validation.css', 
			false, 
			$version);
		
	}
	
	public function enqueue_css_js () {
		if( is_checkout_page() || 
			( is_account_page() && 'profile' == ShoppStorefront()->account['request'] ) ) {
			if( $this->customer_email_validation ) {
				$localize_args = array( 'ajax_url' => admin_url('admin-ajax.php', 'https') );
				if( $this->customer_lookup && is_checkout_page() ) {
					$localize_args['validateEmailFieldSelector'] = '#account-login-checkout';
				}
				wp_localize_script($this->plugin_slug.'_email_validator', 'shoppAdvValid', $localize_args);
				wp_enqueue_script($this->plugin_slug.'_checkout_email');
			}
			if( $this->complexify_password_fields )
				wp_enqueue_script($this->plugin_slug.'_checkout_password');
			if( $this->google_maps_js_api_browser_key )
				wp_enqueue_script($this->plugin_slug.'_address_autocomplete');
		}
		
		if( is_checkout_page() ) {
			if( $this->customer_lookup ) {
				wp_localize_script($this->plugin_slug.'_customer_lookup', 'shoppCustomerLookup', 
					array( 'ajax_url' => admin_url('admin-ajax.php', 'https') ));
				wp_enqueue_script($this->plugin_slug.'_customer_lookup');
			}
		}
		wp_enqueue_style($this->plugin_slug.'_advanced_validation_css');
	}

	public function customer_email_lookup() {
		$email = $_GET['shopp_customer_email_lookup'];
		$email = html_entity_decode($email);

		if( shopp_customer_exists($email, 'email') || false !== email_exists($email) ){
			echo '1';
			die();
		}
		echo '0';
		die();
	}
	
	public function customer_email_validation() {
		if ( ! self::$mailcheck instanceof MailCheck )
			self::$mailcheck = new MailCheck();
		
		$email = $_GET['shopp_customer_email_validation'];
		$email = html_entity_decode($email);

		$returnObj = new StdClass();
		$returnObj->address = $email;
		$returnObj->is_valid = self::$mailcheck->validate_email( $email, true ); //Validate DNS of email's domain
		if( !$returnObj->is_valid )
			$returnObj->did_you_mean = self::$mailcheck->suggest( $email );
		else
			$returnObj->did_you_mean = false;
		echo json_encode( $returnObj );
		die();
	}
}

//Support for Constants in wp-config.php
if( defined('CUSTOMER_EMAIL_VALIDATION') 
	|| defined('GOOGLE_MAPS_JS_API_BROWSER_KEY') 
	|| defined('COMPLEXIFY_PASSWORD_FIELDS')
	|| defined('CUSTOMER_LOOKUP') ) {
	$args = array(); 
	if( defined('CUSTOMER_EMAIL_VALIDATION') )
		$args['customer_email_validation'] = CUSTOMER_EMAIL_VALIDATION;
	if( defined('GOOGLE_MAPS_JS_API_BROWSER_KEY') )
		$args['google_maps_js_api_browser_key'] = GOOGLE_API_BROWSER_KEY;
	if( defined('COMPLEXIFY_PASSWORD_FIELDS') )
		$args['complexify_password_fields'] = COMPLEXIFY_PASSWORD_FIELDS;
	if( defined('CUSTOMER_LOOKUP')){
		$args['customer_lookup'] = CUSTOMER_LOOKUP;
	}
	$ShoppAdvancedValidation = ShoppAdvancedValidation::object( $args );
}
