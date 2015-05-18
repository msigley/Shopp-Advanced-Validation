# Shopp Advanced Validation
Wordpress plugin to add advanced input validation to Shopp's checkout page. (http://shopplugin.net)

This is based on the Mailgun validator:
https://github.com/mailgun/validator-demo

You can also see this page for a working demo:
http://www.mailgun.com/email-validation

## Features
Given an arbitrary address, Mailgun will validate the address based on:

Syntax checks (RFC defined grammar)
DNS validation
Spell checks
Email Service Provider (ESP) specific local-part grammar (if available)

### Advanced Email Validation via Mailgun API

### How to use the email validator on your form

1. Sign up for a Mailgun account get a public API key
2. Add ```defined('MAILGUN_PUBLIC_API_KEY')``` into your wp-config.php file (with the API key from the previous step)
3. Load the shopp-advanced-validation folder into your WP plugins directory and activate the plugin in the WP panel
4. ```#mailgun-message``` can be customized to include your own HTML/CSS.
