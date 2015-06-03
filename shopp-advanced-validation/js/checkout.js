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

        $.ajax({ // FreeGeoIP
            url: '//freegeoip.net/json/',
            type: 'POST',
            dataType: 'jsonp',
            success: function(location) {
                if ((!$('#billing-city').val()) && (!$('#billing-state-menu').val())) { // Only for first page load (city and state must be blank)
                    $('#billing-country').val(location.country_code); // Set country first (required)
                    $('#billing-state-menu').val(location.region_code); // Set state
                    $('#billing-city').val(location.city); // Set city
                    $('#billing-postcode').val(location.zip_code); // Set zip
                }
            }
        });
	
	var emailField = $('#email');
		emailLabel = emailField.siblings('label[for="email"]'),
		emailParent = emailField.parent();
	if( !emailLabel.length )
		emailLabel = $('label[for="email"]');
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
						errorElements.addClass('error');
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
	
	var passwordField = $('#password'),
		passwordLabel = passwordField.siblings('label[for="password"]'),
		passwordParent = passwordField.parent(),
		confirmPasswordField = $('#confirm-password'),
		confirmPasswordLabel = confirmPasswordField.siblings('label[for="confirm-password"]'),
		confirmPasswordParent = confirmPasswordField.parent();
	if( !passwordLabel.length )
		passwordLabel = $('label[for="password"]');
	if( !confirmPasswordLabel.length )
		confirmPasswordLabel = $('label[for="confirm-password"]');
	
	if( passwordField.length ) {
		var passwordStrengthDiv = $('#password-strength');
		if( !passwordStrengthDiv.length ) {
			passwordStrengthDiv = $('<div id="password-strength"><div class="bar"></div></div>');
			passwordStrengthDiv.appendTo(passwordParent);
			generatedCSS = true;
		}
		passwordStrengthDiv.html('');
		var passwordStrengthBar = $('<div class="bar"></div>'),
			passwordStrengthText = $('<div class="text">Strength</div>');
		
		if( generatedCSS ) {
			passwordStrengthDiv.css({ 'border': '1px solid #ddd',
				'background': '#eee',
				'height': passwordLabel.height(),
				'position': 'relative'
				});
			passwordStrengthBar.css({ 'background': '#ccc',
				'height': '100%',
				'width': 0,
				'position': 'relative',
				'z-index': 1
			});
			passwordStrengthText.css({ 'position': 'absolute',
				'top': 0,
				'left': 0,
				'z-index': 2
			});
			passwordStrengthText.width(passwordStrengthDiv.width());
			passwordStrengthText.height(passwordStrengthDiv.height());
			passwordStrengthText.css({ 'font-family': passwordLabel.css('font-family'),
				'font-size': passwordLabel.css('font-size'),
				'font-weight': passwordLabel.css('font-weight'),
				'line-height': passwordStrengthDiv.height()+'px',
				'text-align': 'center',
				'text-overflow': 'ellipsis',
				'color': '#636363'
			});
		}
		
		passwordStrengthBar.appendTo(passwordStrengthDiv);
		passwordStrengthText.appendTo(passwordStrengthDiv);
		
		passwordField.complexify({banMode: 'loose', strengthScaleFactor: 0.5}, function(valid, complexity){
			passwordStrengthDiv.toggleClass('strong', valid);
			passwordStrengthDiv.toggleClass('weak', !valid);
			passwordStrengthBar.width(complexity+'%');
			passwordStrengthText.html( (valid ? 'Strong' : 'Weak') );
			if( generatedCSS )
				passwordStrengthBar.css('background', (valid ? '#5cb85c' : '#d9534f'));
		});
	}
	if( passwordField.length && confirmPasswordField.length ) {
		var passwordFields = $().add([passwordField.get(0), confirmPasswordField.get(0)]);
			passwordMatchDiv = $('#password-match'),
			generatedCSS = false;
		if( !passwordMatchDiv.length ) {
			passwordMatchDiv = $('<div id="password-match"></div>');
			passwordMatchDiv.appendTo(confirmPasswordParent);
			generatedCSS = true;
		}
		if( generatedCSS ) {
			passwordMatchDiv.css({ 'font-family': confirmPasswordLabel.css('font-family'),
				'font-size': confirmPasswordLabel.css('font-size'),
				'font-weight': confirmPasswordLabel.css('font-weight'),
				'line-height': confirmPasswordLabel.css('line-height')
			});	
		}
		passwordMatchDiv.html('').show();
		passwordFields.on('keyup focus input propertychange mouseup', function(e) {
			var confirmVal = confirmPasswordField.val(),
				match = passwordField.val() == confirmVal;
			if( confirmVal ) {
				passwordMatchDiv.toggleClass('match', match);
				passwordMatchDiv.toggleClass('no-match', !match);
				if( match ) {
					passwordMatchDiv.html('Match');	
				} else {
					passwordMatchDiv.html('No Match');
				}
				if( generatedCSS )
					passwordMatchDiv.css('color', (match ? '#5cb85c' : '#d9534f'));
			} else {
				passwordMatchDiv.removeClass('match no-match').html('');	
			}
		});
	}
});
