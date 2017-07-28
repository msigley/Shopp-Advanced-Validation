jQuery(document).ready(function ($) {
	$.shoppCheckoutDiv = $('#shopp #checkout');
	$.shoppAccountLoginInput = $('#account-login-checkout');
	$.shoppCheckCustomerButton = $('#check-for-customer');
	$.shoppCustomerEmail = $('input#email');
	
	//Do nothing if account login input does not exist
	if ($.shoppAccountLoginInput) { 
		if (!$.shoppAccountLoginInput.length)
			return; 
	} else { 
		return; 
	}
	
	if(!window.console) console = {log: function() {}};
	$.fn.setReadonly = function (isDisabled) {
				jQuery(this).each(function () {
						if (isDisabled) {
								jQuery(this).attr("readonly", true).addClass("readonly");
						} else {
								jQuery(this).attr("readonly", false).removeClass("readonly");
						}
				});
				return jQuery(this);
		};
	
	$.shoppCustomerLookup = function( element ) {
		var email = element.val();
		
		//Abort existing AJAX Request to prevent flooding
		if(element.customerLookupRequest) {
			element.customerLookupRequest.abort();
			element.customerLookupRequest = null;
		}
		
		//Prevent duplicate calls
		if (element.data('customer-lookup-last-success-return')) {
			if(email == element.data('customer-lookup-last-success-return'))
				return;
		}
		
		$.shoppCheckoutDiv.removeClass('user-not-exists').removeClass('user-exists');
		
		//Don't lookup empty emails
		if (typeof email == 'undefined' || !email)
			return;
		
		$.shoppCheckCustomerButton.addClass('loading');
		element.setReadonly(true);
		
		if ($.shoppCustomerEmail && $.shoppCustomerEmail.length) {
			$.shoppCustomerEmail.val(email);
			//Fire jQuery Change Events
			$.shoppCustomerEmail.trigger('change');
			//Fire VanillaJS Change Events
			if ("createEvent" in document) {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				$.shoppCustomerEmail.get(0).dispatchEvent(evt);
			} else {
				$.shoppCustomerEmail.get(0).fireEvent("onchange");
			}
		}
		
		element.customerLookupRequest = $.ajax({
			url: shoppAdvValid.ajax_url,
			data: { 'shopp_customer_email_lookup': email,
				'action': 'customer_email_lookup'
			},
			method: 'GET',
			success: function (x, response) {
				element.data('customer-lookup-last-success-return', email);
				if (x == 1) {
					$.shoppCheckoutDiv.addClass('user-exists');
					if ($.clearLatestCheckoutStep)
						$.clearLatestCheckoutStep();
				} else {
					$.shoppCheckoutDiv.addClass('user-not-exists');
				}
				$.shoppCheckCustomerButton.removeClass('loading');
				element.setReadonly(false);
			},
			failure: function () {
				$.shoppCheckCustomerButton.removeClass('loading');
				element.setReadonly(false);
			}
		});
	}
	
	if ($.shoppCustomerEmail && $.shoppCustomerEmail.length) {
		$.shoppCustomerEmail.setReadonly(true);
		$.shoppCustomerEmail.attr('tabindex', '-1');
		$.shoppCustomerEmail.on('focus', function() {
			$.shoppAccountLoginInput.focus();
		});
	}
	$.shoppAccountLoginInput.addClass('shopp-customer-lookup');
	$.shoppAccountLoginInput.on('keypress.shoppCustomerLookup', function(e){
		if (e.keyCode==13) {
			e.preventDefault();
			$.shoppCustomerLookup( $.shoppAccountLoginInput );
		}
	});
	$.shoppAccountLoginInput.on('blur.shoppCustomerLookup', function() {
		$.shoppCustomerLookup( $.shoppAccountLoginInput );
	});
	$.shoppCheckCustomerButton.on('click.shoppCustomerLookup', function() {
		$.shoppCustomerLookup( $.shoppAccountLoginInput );
	});
});