jQuery(document).ready(function($) {
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
	
	var emailFields;
	if( shoppAdvValid.validateEmailFieldSelector )
		emailFields = $(shoppAdvValid.validateEmailFieldSelector);
	else
		emailFields = $('#email');
	
	var ajaxMessageDivExists = $('#ajax-message').length;

	emailFields.each( function() {
		var emailField = $(this);
			emailLabel = emailField.siblings('label');
		if( !emailLabel.length )
			emailLabel = $('label[for="email"]');
		if( emailField.length ) {
			emailField.errorElements = $().add([emailField.get(0), emailLabel.get(0)]);
			emailField.ajaxMessageDiv = $('#ajax-message').hide();
			
			var ajaxQuestion = $('<div class="question">Did you mean: <mark class="did-you-mean"></mark>?</div>'),
				ajaxCorrection = $('<div class="correction">Corrected to: <mark class="did-you-mean"></mark></div>'),
				ajaxVerified = $('<div class="verified">Email verified!</div>'),
				ajaxError = $('<div class="error"></div>');
			
			emailField.showAjaxMessage = function(messageTemplate, options) {
				if( !emailField.ajaxMessageDiv.length ) {
					var emailParent = emailField.parent();
					emailField.ajaxMessageDiv = $('<div id="ajax-message"></div>').hide();
					emailField.ajaxMessageDiv.appendTo(emailParent);
					
					emailParent.css({'position': 'relative'});
					
					emailField.ajaxMessageDiv.css({	'position': 'absolute', 
						'top': emailField.position().top + emailField.outerHeight(), 
						'left': 0,
						'box-sizing': 'border-box',
						'width': emailField.outerWidth(),
						'padding': '5px',
						'background': '#333',
						'color': '#FFF'
					});
					emailField.ajaxMessageDiv.css({ 'font-family': emailField.css('font-family'),
						'font-size': emailField.css('font-size'),
						'font-weight': emailField.css('font-weight'),
						'line-height': 1.5
					});
				}
				
				var messageContent = messageTemplate.clone(true);
				if( options ) {
					if( options.message ) messageContent.html(options.message);
					if( options.didYouMean ) messageContent.find('.did-you-mean').html(options.didYouMean);
				}
				emailField.ajaxMessageDiv.html('').append(messageContent).show();
			};
			
			emailField.customerLookup = emailField.hasClass('shopp-customer-lookup' );

			emailField.hideAjaxMessage = function() {
				emailField.ajaxMessageDiv.hide().html('');	
			};
			
			emailField.hideAjaxMessageEvent = function(e) {
				if( e.data.focusoutEvent && 500 > Date.now() - e.data.focusoutEvent.timeStamp )
					return;
				
				$(this).off('click.emailValidator focusin.emailValidator');
				emailField.hideAjaxMessage();
			};
			
			ajaxQuestion.find('.did-you-mean').css('cursor', 'pointer').on('click', function() {
				emailField.val($(this).text());
				emailField.errorElements.removeClass('error');
				emailField.hideAjaxMessage();
				if( ajaxMessageDivExists )
					emailField.showAjaxMessage(ajaxVerified);	
				if( emailField.customerLookup )
					emailField.trigger('blur.shoppCustomerLookup');
			});
			
			emailField.email_validator({
				in_progress: function(e){
						$(window).off('.emailValidator');
						emailField.hideAjaxMessage();
						emailField.setReadonly(true);
						emailField.errorElements.removeClass('error');
					},
				success: function(data, e){ 
						if( console ) console.log(data);
						
						var emailParts = data.address.split('@'),
							missingTLD = false;
						
						if( -1 === emailParts[1].indexOf('.') ) {
							emailField.errorElements.addClass('error');
							if( data.did_you_mean ) {
								emailField.val(data.did_you_mean);
								emailField.showAjaxMessage(ajaxCorrection, {'didYouMean': data.did_you_mean});
								if( emailField.customerLookup )
									emailField.trigger('blur.shoppCustomerLookup');
							}
						} else {
							if( !data.is_valid )
								emailField.errorElements.addClass('error');
							
							if( data.did_you_mean ) {
								emailField.showAjaxMessage(ajaxQuestion, {'didYouMean': data.did_you_mean});
							} else if( !data.is_valid ) {
								emailField.showAjaxMessage(ajaxError, {'message': 'Invalid email address.'});
							} else {
								emailField.showAjaxMessage(ajaxVerified);	
							}
						}
						
						emailField.setReadonly(false);
						if( !ajaxMessageDivExists )
							$(document).on('click.emailValidator focusin.emailValidator', {'focusoutEvent': e}, emailField.hideAjaxMessageEvent);
					},
				error: function(error, e){
						emailField.errorElements.addClass('error');
						emailField.showAjaxMessage(ajaxError, {'message': error});
						emailField.setReadonly(false);
						if( !ajaxMessageDivExists )
							$(document).on('click.emailValidator focusin.emailValidator', {'focusoutEvent': e}, emailField.hideAjaxMessageEvent);
					}
			});
		}
	});
});

//Polyfill for Date.now support in IE8
if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}