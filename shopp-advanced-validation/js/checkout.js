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
		emailLabel = $('label[for="email"]'),
		emailParent = emailField.parent();
	if( emailField.length ) {
		var errorElements = $().add([emailField.get(0), emailLabel.get(0)]);
		mailgunMessageDiv = $('#mailgun-message').hide(),
		generatedCSS = false;
		if( !mailgunMessageDiv.length ) {
			mailgunMessageDiv = $('<div id="mailgun-message"></div>').hide();
			mailgunMessageDiv.appendTo(emailParent);
			generatedCSS = true;
		}
		
		if( generatedCSS ) {
			emailParent.css({'position': 'relative'});
			
			mailgunMessageDiv.css({	'position': 'absolute', 
				'top': emailField.position().top + emailField.outerHeight(), 
				'left': 0,
				'box-sizing': 'border-box',
				'width': emailField.outerWidth(),
				'padding': '5px',
				'background': '#333',
				'color': '#FFF'
			});	
			mailgunMessageDiv.css({ 'font-family': emailField.css('font-family'),
				'font-size': emailField.css('font-size'),
				'font-weight': emailField.css('font-weight'),
				'line-height': 1.5
			});
		}
		
		var mailgunQuestion = $('<div class="question">Did you mean: <mark class="did-you-mean"></mark>?</div>'),
			mailgunCorrection = $('<div class="correction">Corrected to: <mark class="did-you-mean"></mark></div>'),
			mailgunVerified = $('<div class="verified">Email verified!</div>'),
			mailgunError = $('<div class="error"></div>');
		
		var showMailgunMessage = function(messageTemplate, options) {
			var messageContent = messageTemplate.clone(true);
			if( options ) {
				if( options.message ) messageContent.html(options.message);
				if( options.didYouMean ) messageContent.find('.did-you-mean').html(options.didYouMean);
			}
			mailgunMessageDiv.html('').append(messageContent).show();
		};
		
		var hideMailgunMessage = function() {
			mailgunMessageDiv.hide().html('');	
		};
		
		var hideMailgunMessageEvent = function(e) {
			if( e.data.focusoutEvent && 500 > e.timeStamp - e.data.focusoutEvent.timeStamp )
				return;
			
			$(this).off('click focusin', hideMailgunMessageEvent);
			hideMailgunMessage();
		};
		
		mailgunQuestion.find('.did-you-mean').css('cursor', 'pointer').on('click', function() {
			emailField.val($(this).text());
			errorElements.removeClass('error');
			hideMailgunMessage();
		});
		
		emailField.mailgun_validator({
			api_key: shoppAdvValid.mailgunPubKey,
			in_progress: function(e){
					$(window).off('click focusin', hideMailgunMessageEvent);
					hideMailgunMessage();
					emailField.setDisabled(true);
					errorElements.removeClass('error');
				},
			success: function(data, e){ 		
					if( console ) console.log(data);
					
					var emailParts = data.address.split('@'),
						missingTLD = false;
					
					if( -1 === emailParts[1].indexOf('.') ) {
						if( data.did_you_mean ) {
							emailField.val(data.did_you_mean);
							showMailgunMessage(mailgunCorrection, {'didYouMean': data.did_you_mean});
						}
					} else {
						if( !data.is_valid )
							errorElements.addClass('error');
						
						if( data.did_you_mean ) {
							showMailgunMessage(mailgunQuestion, {'didYouMean': data.did_you_mean});
						} else if( !data.is_valid ) {
							showMailgunMessage(mailgunError, {'message': 'Invalid email address.'});
						} else {
							showMailgunMessage(mailgunVerified);	
						}
					}
					
					emailField.setDisabled(false);
					$(window).on('click focusin', {'focusoutEvent': e}, hideMailgunMessageEvent);
				},
			error: function(error, e){
					errorElements.addClass('error');
					showMailgunMessage(mailgunError, {'message': error});
					emailField.setDisabled(false);
					$(window).on('click focusin', {'focusoutEvent': e}, hideMailgunMessageEvent);
				},
		});
	}
});