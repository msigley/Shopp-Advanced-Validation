# Shopp Advanced Validation
Wordpress plugin to add advanced input validation to Shopp's checkout page. (http://shopplugin.net)

### Installation
* Load the shopp-advanced-validation folder into your WP plugins directory and activate the plugin in the WP panel

## 1. Advanced Email Validation via mailcheck-php

https://github.com/msigley/mailcheck-php

### Features
Given an arbitrary address, MailCheck will validate the address based on:

* Syntax checks (RFC defined grammar)
* DNS validation
* Spell checks

### How to use the email validator on your Shopp

1. Add ```defined('CUSTOMER_EMAIL_VALIDATION', true);``` into your wp-config.php file
2. ```#ajax-message``` can be customized to include your own HTML/CSS.


## 2. Password strength evaluation via the jQuery Complexify algorithm.

This is based on the Complexify algorithm:
https://www.danpalmer.me/jquery-complexify

### Features
Casually enforces password strength via Complexity algorithm and also banned password lists.

* Password strength indicator
* 500 most common Twitter passwords are banned
* Provides "Match" / "No Match" indicators for verification.

### How to use the password strength indicator on your Shopp
1. Sign up for a Mailgun account get a public API key.
2. Add ```defined('COMPLEXIFY_PASSWORD_FIELDS', true);``` into your wp-config.php file.
3. ```<div id="password-strength"></div>``` and/or ```<div id="password-match"></div>``` can be customized to include your own HTML/CSS.

## 3. Google Maps Places API address auto complete.

This is based on the Google places autocomplete:
https://google-developers.appspot.com/maps/documentation/javascript/examples/full/places-autocomplete-addressform

### Features
Dropdown autocomplete address list based on user's current location, autofills remaining fields once an address is selected. Provides geolocated coordinates by browser, or using freegeoIP as a fallback. If Google is not supported in certain regions (e.g., China), the library is not loaded.

### Quirks
Lookup chokes if you add in apartment numbers since these are not supported by Google.

### How to use the Google places autocomplete on your Shopp
1. Sign up for a Google Maps Javascript API browser key. https://developers.google.com/console/help/new/?hl=en_US#credentials-access-security-and-identity
2. Add ```defined('GOOGLE_MAPS_JS_API_BROWSER_KEY', 'YOUR_BROWSER_KEY');``` into your wp-config.php file.
3. You can include ```&placeholder=Enter your address``` in your checkout.php template for the billing-address and/or shipping-address fields for additional user prompting.

## 4. Customer account existance verification on email field durring checkout

This is allows for custom checkout workflows to direct existing customers to login at checkout.
Example: http://electricquilt.com

This is an advanced feature intended to help reduce the work on custom checkout workflows. It is not a "turn it on and it just works" feature and involves adding code to your custom checkout theme template.

### How to use the customer account existance verification on your Shopp
1. In your custom Shopp checkout theme template: 
    1. Add this code to the top of the template:
		```
		<?php 
		$customer_email = shopp('checkout','get-email','mode=value'); 
		$customer_exists_class = '';
		if( !empty($customer_email) ) {
			$customer_exists = shopp_customer_exists($customer_email, 'email'); 
			$customer_exists_class = ' user-not-exists';
			if( $customer_exists ) $customer_exists_class = ' user-exists';
		}
		?>
		```
		2. Change the class attribute on your ```<form>``` to include the following at the end:
		```
		<?php echo $customer_exists_class; ?>
		```
		3. Change your 'account-login' theme api call to something that resembles the following:
		```
		<?php shopp('customer','account-login', array('value' => $customer_email, 'data-customer-lookup-last-success-return' => $customer_email)); ?>
		<input id="check-for-customer" type="button" value="Next">
		```
2. The customer account existance should now be working. 
		1. If an account with the customer's email exists, a "user-exists" css class is added to the shopp checkout form:
				* The css selector for this is ```#shopp #checkout .user-exists```.
		2. If an account with the customer's email does not exist, a "user-not-exists" css class is added to the shopp checkout form:
				* The css selector for this is ```#shopp #checkout .user-not-exists```.
3. Use custom css in your custom shopp theme to show/hide or change the look of elements based on whether the customer has an existing account or not.
