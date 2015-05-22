# Shopp Advanced Validation
Wordpress plugin to add advanced input validation to Shopp's checkout page. (http://shopplugin.net)

### Installation
* Load the shopp-advanced-validation folder into your WP plugins directory and activate the plugin in the WP panel

## 1. Advanced Email Validation via Mailgun API

This is based on the Mailgun validator:
https://github.com/mailgun/validator-demo

You can also see this page for a working demo:
http://www.mailgun.com/email-validation

### Features
Given an arbitrary address, Mailgun will validate the address based on:

* Syntax checks (RFC defined grammar)
* DNS validation
* Spell checks
* Email Service Provider (ESP) specific local-part grammar (if available)

### How to use the email validator on your Shopp

1. Sign up for a Mailgun account get a public API key
2. Add ```defined('MAILGUN_PUBLIC_API_KEY')``` into your wp-config.php file (with the API key from the previous step)
3. Load the shopp-advanced-validation folder into your WP plugins directory and activate the plugin in the WP panel
4. ```#mailgun-message``` can be customized to include your own HTML/CSS.


## 2. Password strength evaluation via the jQuery Complexify algorithm.

This is based on the Complexify algorithm:
https://www.danpalmer.me/jquery-complexify

### Features
Casually enforces password strength via Complexity algorithm and also banned password lists.

* Password strength indicator
* 500 most common Twitter passwords are banned
* Provides "Match" / "No Match" indicators for verification.

### How to use the password strength indicator on your Shopp

```<div id="password-strength"></div>``` and/or ```<div id="password-match"></div>``` can be customized to include your own HTML/CSS.
