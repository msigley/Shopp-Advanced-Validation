jQuery(document).ready(function($) {
	$.fn.setDisabled = function (isDisabled) {
        jQuery(this).each(function () {
            if (isDisabled) {
                jQuery(this).attr("disabled", true).addClass("disabled");
            } else {
                jQuery(this).attr("disabled", false).removeClass("disabled");
            }
        });
        return jQuery(this);
    };
	
	var emailField = $('#email');
	if( emailField.length ) {
		emailField.mailgun_validator({
			api_key: shoppAdvValid.mailgunPubKey,
			in_progress: function(){ 		
					if( console ) console.log('mailgun in progress');
					emailField.setDisabled(true);
				},
			success: function(data){ 		
					if( console ) console.log(data);
					emailField.setDisabled(false);
				},
			error: function(error){ 		
					if( console ) console.log('Error: '+error);
					emailField.setDisabled(false);
				},
		});
	}
});