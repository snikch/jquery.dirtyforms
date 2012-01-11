Dirty Forms
=======================================
Dirty Forms is a jQuery plugin to help prevent users from losing data when editing forms.

Dirty Forms will alert a user when they attempt to leave a page without submitting a form they have entered data into. It alerts them in a modal popup box, and also falls back to the browser's default onBeforeUnload handler for events outside the scope of the document such as, but not limited to, page refreshes and browser navigation buttons.

Oh, and it's pretty easy to use.
	
```javascript
$('form').dirtyForms();
```

Existing solutions were not flexible enough, so I wrote this to make sure that all of our use cases at Learnable would be supported. This included using TinyMCE as a rich text editor and ensuring dirty tinymce instances mark their form as dirty. I've also ensured that event bubbling on links and forms are propagated correctly. Dirty Forms will only attempt to alert the user if the event has not had the preventDefault() method called, and will accordingly refire events if the user chooses to continue from the page - ensuring all click handlers, and form submission handlers are correctly fired. For this reason, Dirty Forms should be the last jQuery plugin included, as it needs to be the last bound handler in the event stack.

The .live() method is used to attach click and submit handlers so even elements that are introduced to the page after the page has loaded, e.g. loaded dynamically through AJAX, will be handled correctly, and a 'form stash' was created to capture and save event targets at the beginning of the event / decision stage so that elements that are no longer in the DOM can still have events fired on them (e.g. when a form is in a modal box, then the modal box is replaced by the Dirty Forms confirmation, the form will be stashed, and if the event is refired, it will be added back to the DOM then have the event triggered on it). 

Status
---------------------------------
Feature complete, browser tested - about to go into a production environment for more testing.

Usage
---------------------------------
```javascript
// Enable for all forms
$('form').dirtyForms();

// Enable for just forms of class 'sodirty'
$('form.sodirty').dirtyForms();

// Enable Debugging
$.DirtyForms.debug = true;

// Two custom selectors are available
// Select all forms that are dirty
$('form:dirty');

// Select all forms that are being watched for changes
$('form:dirtylistening');
```

Options
---------------------------------
The following options are available to set via $.DirtyForms.OPTIONNAME = OPTIONVALUE

debug: set to true to log messages to the firebug console (or alert if you don't have firebug)

message: The dialog message to be sent

title: The modal dialog title

dirtyClass: The class applied to elements when they're considered dirty

listeningClass: The class applied to elements that are having their inputs monitored for change

helpers: An array for helper objects. See Helpers below

dialog: See Dialogs below


Public Methods
---------------------------------
$.DirtyForms.isDirty() will return true if any watched elements are considered dirty
	if($.DirtyForms.isDirty())

$.fn.dirtyForms() will start watching the supplied elements for descendant input changes
	$('form').dirtyForms();

$.fn.isDirty() will return true if the provided element is considered dirty
	if($('form#accountform').isDirty())

$.fn.setDirty() will set the provided element as dirty
	$('form#accountform').setDirty();

$.fn.cleanDirty() will mark the provided form as clean
	$('form#accountform').cleanDirty();

Helpers
---------------------------------
Dirty Forms was created because the similar plugins that existed were not flexible enough. To provide more flexibility a basic helper framework has been added. With this, you can add in new helper objects which will provide additional ability to check for whether a form is dirty or not.

This is useful when you're using replacement inputs or textarea, such as with tinymce. To enable the tinymce helper, simply include the helpers/tinymce.js file.

Currently only the isDirty and isNodeDirty methods are available to helpers.

```javascript
// Example helper, the form is always considered dirty
// Create a new object, with an isDirty method
var alwaysDirty = {
	isDirty : function(){
		// General catch all is dirty check	
	},
	isNodeDirty : function(node){
		// Logic here to determine if the given node is dirty, return true if it is
		return true; 
	}
}
// Push the new object onto the helpers array
$.DirtyForms.helpers.push(alwaysDirty);
```

Dialogs
---------------------------------
The default facebox dialog can be overriden by setting a new dialog object.

The dialog object REQUIRES you to set four methods and a property.

Methods: fire, refire, bind, stash

Property: selector

```javascript
// Selector is a selector string for dialog content. Used to determin if event targets are inside a dialog
selector : '#facebox .content',


// Fire starts the dialog
fire : function(message, title){
	var content = '<h1>' + title + '</h1><p>' + message + '</p><p><a href="#" class="ignoredirty continue">Continue</a><a href="#" class="ignoredirty cancel">Stop</a>';
	$.facebox(content);		 
},
// Bind binds the continue and cancel functions to the correct links
bind : function(){
	$('#facebox .cancel, #facebox .close').click(decidingCancel);
	$('#facebox .continue').click(decidingContinue);
	$(document).bind('decidingcancelled.dirtyform', function(){
		$(document).trigger('close.facebox');
	});				
},

// Refire handles closing an existing dialog AND fires a new one
refire : function(content){
	var rebox = function(){
		$.facebox(content);
		$(document).unbind('afterClose.facebox', rebox);
	}
	$(document).bind('afterClose.facebox', rebox);
},

// Stash returns the current contents of a dialog to be refired after the confirmation
// Use to store the current dialog, when it's about to be replaced with the confirmation dialog. This function can return false if you don't wish to stash anything.
	stash : function(){
		var fb = $('#facebox .content');
		return ($.trim(fb.html()) == '' || fb.css('display') != 'block') ?
		   false :
		   fb.clone(true);
	}
```

fire accepts a message and title, and is responsible for creating the modal dialog. Note the two classes on each link. In the binddialog method you will see that we bind the 'decidingCancel' method to the .cancel link and the .close link, and we bind 'decidingContinue' to the .continue link. You must bind both decidingCancel and decidingContinue in the bindDialog method.

If you don't want to use a dialog at all, simply pass in false instead of an object.

```javascript
$.DirtyForms.dialog = {
	selector : '#mylightbox .body',
	fire : function (){ ... },
	refire : function (){ ... },
	stash : function (){ ... },
	bind : function (){ ... }
}
```

Triggers
---------------------------------

You can attach callbacks to the decidingcancelled.dirtyforms and decidingcontinued.dirtyforms custom events. These events are called when the cancel, or continue method on the modal dialog is called (when the user clicks either continue, or cancel).

These triggers are not available when used with the browser fallback dialog method.

Also available is defer.dirtyforms for accessing elements on the page prior to the dialog box alerting the user is called, and beforeRefire.dirtyforms, called before the original event is refired after a user chooses to leave the page (useful if you need to do things like save data back to fields which is normally part of event propagation - ala tinyMce).

Selectors
---------------------------------

:dirty will select all elements with the dirty class attached. form:dirty would be all forms that are currently dirty for example.

:dirtylistening will select all elements that has the listening class attached. This should be all forms that are currently listening for change


