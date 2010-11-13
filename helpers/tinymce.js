// TinyMCE helper, checks to see if TinyMCE editors in the given form are dirty
(function($){
	// Create a new object, with an isDirty method
	var tinymce = {
		isDirty : function(form){
			var isDirty = false;
			// Search for all tinymce elements inside the given form
			$(':tinymce', form).each(function(){
				if($(this).tinymce().isDirty()){
					isDirty = true;
					return true;
				}
			});	
					 
			return isDirty;
		}
	}
	// Push the new object onto the helpers array
	$.DirtyForms.helpers.push(tinymce);
})(jQuery);

