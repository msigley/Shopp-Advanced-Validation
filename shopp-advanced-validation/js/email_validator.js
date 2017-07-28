//
// Email Address Validation Plugin
//
// Attaching to a form:
//
//    $('jquery_selector').mailgun_validator({
//        api_key: 'api-key',
//        in_progress: in_progress_callback, // called when request is made to validator
//        success: success_callback,         // called when validator has returned
//        error: validation_error,           // called when an error reaching the validator has occured
//    });
//
//
// Sample JSON in success callback:
//
//  {
//      "is_valid": true,
//      "parts": {
//          "local_part": "john.smith@example.com",
//          "domain": "example.com",
//          "display_name": ""
//      },
//      "address": "john.smith@example.com",
//      "did_you_mean": null
//  }
//
//

(function( $ ) {
	$.fn.email_validator = function(options) {
	    return this.each(function() {
	    	var thisElement = $(this);
	        thisElement.focusout(function(e) {
				//Fix for buggy event timestamps in Firefox and IE
				e.timeStamp = Date.now();
	        	//Trim string and autocorrect whitespace issues
	        	var elementValue = thisElement.val();
	        	elementValue = $.trim(elementValue);
	        	thisElement.val(elementValue);
	        	
	        	//Attach event to options
	        	options.e = e;

	          run_validator(elementValue, options, thisElement);
	        });
	    });
	};
	
	function run_validator(address_text, options, element) {
		//Abort existing AJAX Request to prevent flooding
		if(element.ajaxRequest) {
			element.ajaxRequest.abort();
			element.ajaxRequest = null;
		}
		
	  // don't run validator without input
	  if (!address_text) {
	      return;
	  }
		
		// validator is in progress
	  if (options && options.in_progress) {
	      options.in_progress(options.e);
	  }
		
		// don't run dupicate calls
		if (element.ajaxLastSuccessReturn) {
			if (address_text == element.ajaxLastSuccessReturn.address) {
				if (options && options.success) {
	                options.success(element.ajaxLastSuccessReturn, options.e);
	            }
				return;
			}
		}
		
	  // length and @ syntax check
	  var error_message = false;
	  if (address_text.length > 512)
	    error_message = 'Email address exceeds maxiumum allowable length of 512.';
	  else if (1 !== address_text.split('@').length-1)
	    error_message = 'Email address must contain only one @.';
	    
	  if (error_message) {
	    if (options && options.error) {
	        options.error(error_message, options.e);
	    }
	    else {
	        if (console) console.log(error_message);
	    }
	    return;
	  }
		
		// timeout incase of some kind of internal server error
	  var timeoutID = setTimeout(function() {
				error_message = 'Error occurred, unable to validate address.';
				//Abort existing AJAX Request for a true timeout
				if(element.ajaxRequest) {
					element.ajaxRequest.abort();
					element.ajaxRequest = null;
				}
		
				if (options && options.error) {
						options.error(error_message, options.e);
				}
				else {
						if (console) console.log(error_message);
				}
			}, 10000); //10 seconds
		
	    // make ajax call to get validation results
	    element.ajaxRequest = $.ajax({
	        url: shoppAdvValid.ajax_url,
			data: { shopp_customer_email_validation: address_text, action: 'customer_email_validation' },
			type: "GET",
			dataType: "json",
	        success: function(data, status_text) {
	            clearTimeout(timeoutID);
	            
	            element.ajaxLastSuccessReturn = data;
	            if (options && options.success) {
	                options.success(data, options.e);
	            }
	        },
	        error: function(request, status_text, error) {
	            clearTimeout(timeoutID);
	            error_message = 'Error occurred, unable to validate address.';
	
	            if (options && options.error) {
	                options.error(error_message, options.e);
	            }
	            else {
	                if (console) console.log(error_message);
	            }
	        }
	    });
	}
})( jQuery );

//Polyfill for Date.now support in IE8
if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}