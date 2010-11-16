// Example helper, the form is always considered dirty
(function($){
	// Create a new object, with an isDirty method
	var alwaysDirty = {
		isDirty : function(){
			return true; 
		},
		isNodeDirty : function(node){
			// Perform dirty check on a given node (usually a form element)			  
		}
	}
	// Push the new object onto the helpers array
	$.DirtyForms.helpers.push(alwaysDirty);
})(jQuery);
