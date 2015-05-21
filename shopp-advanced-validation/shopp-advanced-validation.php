<?php 
/*
Plugin Name: Shopp Advanced Validation
Plugin URI: http://github.com/msigley/
Description: Implements advanced email validation on the shopp checkout page.
Version: 1.2.0
Author: Matthew Sigley
Author URI: http://github.com/msigley/
License: GPLv3
*/
class ShoppAdvancedValidation {
	private static $object = null;
	private static $contruct_args = array( 'mailgun_public_api_key' );
	
	private $mailgun_public_api_key = null;
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
		
		wp_register_script($this->plugin_slug.'_mailgun_validator', 
				$this->url.'js/mailgun_validator.js',
				array('jquery'),
				$version
				);
		wp_register_script($this->plugin_slug.'_complexify_banlist', 
				$this->url.'js/jquery.complexify.banlist.js',
				false,
				$version
				);
		wp_register_script($this->plugin_slug.'_complexify', 
				$this->url.'js/jquery.complexify.js',
				array('jquery', $this->plugin_slug.'_complexify_banlist'),
				$version
				);
		wp_register_script($this->plugin_slug.'_checkout', 
				$this->url.'js/checkout.js',
				array($this->plugin_slug.'_mailgun_validator', $this->plugin_slug.'_complexify'),
				$version
				);
		
		wp_localize_script($this->plugin_slug.'_checkout', 'shoppAdvValid', 
				array( 'mailgunPubKey' => $this->mailgun_public_api_key )
				);
	}
	
	public function enqueue_css_js () {
		if( is_checkout_page() || 
			( is_account_page() && 'profile' == ShoppStorefront()->account['request'] ) ) {
			wp_enqueue_script($this->plugin_slug.'_checkout');
		}
	}
}

//Support for Constants in wp-config.php
if( defined('MAILGUN_PUBLIC_API_KEY') ) {
	$args = array( 'mailgun_public_api_key' => MAILGUN_PUBLIC_API_KEY );
	$ShoppAdvancedValidation = ShoppAdvancedValidation::object( $args );
}