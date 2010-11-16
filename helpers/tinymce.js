// TinyMCE helper, checks to see if TinyMCE editors in the given form are dirty
(function($){
	// Create a new object, with an isDirty method
	var tinymce = {
		isNodeDirty : function(form){
			var isDirty = false;
			//..alert('in finder');
			// Search for all tinymce elements inside the given form
			$(form).find(':tinymce').each(function(){

				dirtylog('Checking node ' + $(this).attr('id'));
				if($(this).tinymce().isDirty()){
					isDirty = true;
					dirtylog('Node was totally dirty.');
					return true;
				}
			});	
					 
			return isDirty;
		}
	}
	// Push the new object onto the helpers array
	$.DirtyForms.helpers.push(tinymce);
})(jQuery);

