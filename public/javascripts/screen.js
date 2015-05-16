$(function(){
	$('ul.nav').on('click', 'a', function(e){
		e.preventDefault();
		$(this).closest('.nav').find('li').removeClass('active');
		$(this).closest('li').addClass('active');
		
		var menuTarget = $(this).attr('href');
		
		$.ajax({
			url: menuTarget
		})
		.done(function(html){
			$('#content').empty().append(html);
		})
		.fail(function(msg){
			$('#content').empty().append('Error');
		});
	});
	
	$('body').on('submit', 'form' , function(e){
		e.preventDefault();
		var form = $(this);
		var formTarget = form.attr('action');
		var hasError = form.find('.form-group').hasClass('has-error');
	
		
		if(!hasError){
			$.ajax({
				method: 'POST',
				url: formTarget,
				data: form.serialize()
			})
			.done(function(msg){
				addFormSuccess(form, msg);
			})
			.fail(function(msg){
				addFormError(form , msg.responseText);
			});
		}
		
		addFormError(form);
	});
	
	$('body').on('focusout', ':input' , function(e){
		e.preventDefault();
		var input = $(this);
		var inputValidation = input.data('valid');
		var inputValue = input.val();
		
		if(inputValidation !== undefined)
		{
			$.ajax({
				method: 'POST',
				url: inputValidation,
				data: {value: inputValue}
			})
			.done(function(msg){
				addValidationSuccess(input);
			})
			.fail(function(msg){
				addValidationError(input, msg.responseText);
			});
		}
	});
});

function addValidationSuccess(input , msg){
	msg = typeof msg !== 'undefined' ? msg : '';
	
	var formGroup = input.parent();
	formGroup.find('.help-block').remove();
	formGroup.removeClass('has-warning');
	formGroup.removeClass('has-error');
	formGroup.addClass('has-success');
};

function addValidationError(input, msg){
	msg = typeof msg !== 'undefined' ? msg : '';
	
	var formGroup = input.parent();
	formGroup.find('.help-block').remove();
	formGroup.removeClass('has-warning');
	formGroup.removeClass('has-success');
	formGroup.addClass('has-error');
	var html = '<span class="help-block"><ul class="list-unstyled">'
		+ '<li>'
		+'<span class="glyphicon glyphicon-exclamation-sign"></span>'
		+ msg +'</li></ul></span>';
	
	input.after(html);
};

function addFormSuccess(form, msg){
	msg = typeof msg !== 'undefined' ? msg : 'Form Submitted!';
	
	form.find('.alert').remove();
	
	var html = '<div class="alert alert-success alert-dismissible"><ul class="list-unstyled">'
		+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ '<li>' + msg + '</li></ul></div>';
	
	form.prepend(html);
}

function addFormError(form, msg){
	msg = typeof msg !== 'undefined' ? msg : 'This form has errors.';
	
	form.find('.alert').remove();
	
	var html = '<div class="alert alert-danger alert-dismissible"><ul class="list-unstyled">'
		+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ '<li>' + msg + '</li></ul></div>';
	
	form.prepend(html);
}