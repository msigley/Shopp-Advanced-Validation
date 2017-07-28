jQuery(document).ready(function($) {
	var passwordField = $('#password'),
		passwordLabel = passwordField.siblings('label[for="password"]'),
		passwordParent = passwordField.parent(),
		confirmPasswordField = $('#confirm-password'),
		confirmPasswordLabel = confirmPasswordField.siblings('label[for="confirm-password"]'),
		confirmPasswordParent = confirmPasswordField.parent(),
		generatedCSS = false;
	if( !passwordLabel.length )
		passwordLabel = passwordField;
	if( !confirmPasswordLabel.length )
		confirmPasswordLabel = confirmPasswordField;
	
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