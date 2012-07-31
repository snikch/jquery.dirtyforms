Dirty Forms
=======================================
Dirty Forms is a jQuery plugin to help prevent users from losing data when editing forms.

Dirty Forms will alert a user when they attempt to leave a page without submitting a form they have entered data into. It alerts them in a modal popup box, and also falls back to the browser's default onBeforeUnload handler for events outside the scope of the document such as, but not limited to, page refreshes and browser navigation buttons.

Oh, and it's pretty easy to use.

```javascript
$('form').dirtyForms();
```

Existing solutions were not flexible enough, so I wrote this to make sure that all of our use cases at Learnable would be supported. This included using TinyMCE as a rich text editor and ensuring dirty tinymce instances mark their form as dirty. I've also ensured that event bubbling on links and forms are propagated correctly. Dirty Forms will only attempt to alert the user if the event has not had the preventDefault() method called, and will accordingly refire events if the user chooses to continue from the page - ensuring all click handlers, and form submission handlers are correctly fired. For this reason, Dirty Forms should be the last jQuery plugin included, as it needs to be the last bound handler in the event stack.

The jQuery .on() method (or .delegate() method in jQuery prior to version 1.7) is used to attach click and submit handlers so even elements that are introduced to the page after the page has loaded, e.g. loaded dynamically through AJAX, will be handled correctly, and a 'form stash' was created to capture and save event targets at the beginning of the event / decision stage so that elements that are no longer in the DOM can still have events fired on them (e.g. when a form is in a modal box, then the modal box is replaced by the Dirty Forms confirmation, the form will be stashed, and if the event is refired, it will be added back to the DOM then have the event triggered on it).

Status
---------------------------------
Feature complete, browser tested - about to go into a production environment for more testing.

Prerequisites
---------------------------------
Must have jQuery version 1.4.2 or higher. 

When using the TinyMCE helper, the [jQuery plugin for TinyMCE](http://www.tinymce.com/download/download.php "jQuery plugin for TinyMCE") is required. Likewise when using the CkEditor helper, the [jQuery plugin for CkEditor](http://ckeditor.com/blog/CKEditor_for_jQuery "jQuery plugin for CkEditor") is required.

**Note:** There are [known compatibility issues](http://bugs.jquery.com/ticket/11527) between jQuery 1.7.2 and higher and TinyMCE versions lower than 3.5b3. These issues can cause the dialog continue function to fail in dirtyForms.

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
The following options are available to set via **$.DirtyForms.OPTIONNAME = OPTIONVALUE** or get via **OPTIONVALUE = $.DirtyForms.OPTIONNAME**

**debug**: set to true to log messages to the firebug console (or alert if you don't have firebug).

**message**: The dialog message to be sent.

**title**: The modal dialog title.

**dirtyClass**: The class applied to elements when they're considered dirty.

**listeningClass**: The class applied to elements that are having their inputs monitored for change.

**ignoreClass**: The class applied to elements that you wish to allow the action to be continue even when the form is dirty.

**choiceContinue**: Set to true from the dialog to indicate to continue execution of the link or button that was clicked or false to cancel. Execution of the choice will be deferred until *choiceCommit()* is called.

**helpers**: An array for helper objects. See Helpers below.

**dialog**: See Dialogs below.


Public Methods
---------------------------------
**$.DirtyForms.isDirty()** will return true if any watched elements are considered dirty.
    *Syntax:* ***if($.DirtyForms.isDirty())***

**$.fn.dirtyForms()** will start watching the supplied elements for descendant input changes.
    *Syntax:* ***$('form').dirtyForms();***

**$.fn.dirtyForms('isDirty')** will return true if the provided element is considered dirty.
    *Syntax:* ***if($('form#accountform').dirtyForms('isDirty'))***

**$.fn.dirtyForms('setDirty')** will set the provided element as dirty.
    *Syntax:* ***$('form#accountform').dirtyForms('setDirty');***

**$.fn.dirtyForms('setClean')** will mark the provided form or element as clean.  
    *Syntax:* ***$('form#accountform').dirtyForms('setClean');***

**$.DirtyForms.choiceCommit()** should be called after the dialog is closed to commit the choice that was specified in *$.DirtyForms.choiceContinue*. This method will cascade the call to either *$.DirtyForms.decidingContinue()* or *$.DirtyForms.decidingCancel()* automatically, so there is no need to use them in conjunction with this method. An event object is required to be passed as a parameter.  
    *Syntax:* ***$.DirtyForms.choiceCommit(event);***

**$.DirtyForms.decidingContinue()** should be called from the dialog to refire the event and continue following the link or button that was clicked. An event object is required to be passed as a parameter.  
    *Syntax:* ***$.DirtyForms.decidingContinue(event);***
	
**$.DirtyForms.decidingCancel()** should be called from the dialog to indicate not to move on to the page of the button or link that was clicked. An event object is required to be passed as a parameter.  
    *Syntax:* ***$.DirtyForms.decidingCancel(event);***

**$.DirtyForms.isDeciding()** will return true if the dialog has fired and neither *$.DirtyForms.decidingCancel()* or *$.DirtyForms.decidingContinue()* has yet been called.
    *Syntax:* ***if($.DirtyForms.isDeciding())***


Obsolete Public Methods
---------------------------------
**IMPORTANT**: The following methods have been completely removed from the public interface to avoid collisions with other JavaScript code. This is a **breaking change**. Please update your code before getting the current version.

*decidingContinue()*
    Please use ***$.DirtyForms.decidingContinue()*** instead

*decidingCancel()*
    Please use ***$.DirtyForms.decidingCancel()*** instead

The following methods have been deprecated and will eventually be removed from dirtyForms. Please update your code to access the new methods as shown here. This was done to conform to jQuery plugin authoring guidelines (http://docs.jquery.com/Plugins/Authoring).

*$.fn.isDirty()* -- former syntax: *$('form#accountform').isDirty()*
    Please use ***$('form#accountform').dirtyForms('isDirty')*** instead

*$.fn.setDirty()* -- former syntax: *$('form#accountform').setDirty()*
    Please use ***$('form#accountform').dirtyForms('setDirty')*** instead

*$.fn.cleanDirty()* -- former syntax: *$('form#accountform').cleanDirty()*
    Please use ***$('form#accountform').dirtyForms('setClean')*** instead


Helpers
---------------------------------
Dirty Forms was created because the similar plugins that existed were not flexible enough. To provide more flexibility a basic helper framework has been added. With this, you can add in new helper objects which will provide additional ability to check for whether a form is dirty or not.

This is useful when you're using replacement inputs or textarea, such as with tinymce. To enable the tinymce helper, simply include the helpers/tinymce.js file. Same goes for helpers/ckeditor.js.

**MEMBERS (All Optional)**

**isDirty(node)** - method - Should return the dirty status of the helper.

**setClean(node)** - method - Should reset the dirty status of the helper so *isDirty(node)* will return false the next time it is called.

**ignoreAnchorSelector** - property - A jQuery selector of any anchor elements to exclude from activating the dialog. Non-anchors will be ignored. This works similarly to putting the ignoreClass on a specific anchor, but will always ignore the anchors if your helper is included.


The node parameter is typically an individual form element. To respect the way jQuery selectors work, all children of the node as well as the node itself should have your custom **isDirty()** and **setClean()** logic applied.

**IMPORTANT**: Support for the former *isNodeDirty(node)* method has been deprecated. Please update any custom helpers to use **isDirty(node)**. This change was made to make helpers easier to understand and use.


```javascript
// Example helper, the form is always considered dirty
(function($){
	// Create a new object, with an isDirty method
	var alwaysDirty = {
		// Ignored anchors will not activate the dialog
		ignoreAnchorSelector : '.editor a, a.toolbar',
		isDirty : function(node){
			// Perform dirty check on a given node (usually a form element)
			return true;
		},
		setClean : function(node){
			// Perform logic to reset the node so the isDirty function will return true
			// the next time it is called for this node.

		}
		// To ensure full support with jQuery selectors,
		// make sure to run the action on all descendent
		// children of the node parameter. This is
		// accomplished easily by using the .find() jQuery
		// method.
		//
		// $(node).find('.mySelector').each(function(){
		//     Run desired action against the child
		//     node here
		//     doSomething(this);
		// });
		// Run desired action against $(node) to handle the case
		// of a selector for a specific DOM element
		// if ($(node).hasClass('.mySelector')) { doSomething(node); }

	}
	// Push the new object onto the helpers array
	$.DirtyForms.helpers.push(alwaysDirty);
})(jQuery);
```

Dialogs
---------------------------------
The default facebox dialog can be overriden by setting a new dialog object.

The dialog object **requires** you to set four methods and a property.

Methods:

- **fire**
- **refire**
- **bind**
- **stash**

Property:

- **selector**


```javascript
// Selector is a selector string for dialog content. Used to determine if event targets are inside a dialog
selector : '#facebox .content',


// Fire starts the dialog
fire : function(message, title){
	var content = '<h1>' + title + '</h1><p>' + message + '</p><p><a href="#" class="ignoredirty continue">Continue</a><a href="#" class="ignoredirty cancel">Stop</a>';
	$.facebox(content);
},
// Bind binds the continue and cancel functions to the correct links
bind : function(){
	$('#facebox .cancel, #facebox .close').click($.DirtyForms.decidingCancel);
	$('#facebox .continue').click($.DirtyForms.decidingContinue);
	$(document).bind('decidingcancelled.dirtyforms', function(){
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
// Use to store the current dialog, when it's about to be replaced with the confirmation dialog.
// This function can return false if you don't wish to stash anything.
stash : function(){
	var fb = $('#facebox .content');
	return ($.trim(fb.html()) == '' || fb.css('display') != 'block') ?
	   false :
	   fb.clone(true);
}
```

**fire** accepts a message and title, and is responsible for creating the modal dialog. Note the two classes on each link. In the **bind** method you will see that we bind the *$.DirtyForms.decidingCancel* method to the .cancel link and the .close link, and we bind *$.DirtyForms.decidingContinue* to the .continue link. You must bind both *$.DirtyForms.decidingCancel* and *$.DirtyForms.decidingContinue* in the **bind** method.

Alternatively, another pattern is supported for modal dialogs where the continuing execution of the event is not allowed until after the dialog is closed (such as when using jQuery UI dialog in modal mode). The pattern uses a boolean property named **$.DirtyForms.choiceContinue** to indicate the dialog choice and a method named **$.DirtyForms.choiceCommit()** to execute the choice. Here is an example of that pattern in action using a modal jQuery UI dialog:

```javascript
$.DirtyForms.dialog = {
	selector: '#unsavedChanges',
	fire: function(message, dlgTitle) {
		$('#unsavedChanges').dialog({title: dlgTitle, width: 350, modal: true});
		$('#unsavedChanges').html(message);
	},
	bind: function() {
		$('#unsavedChanges').dialog('option', 'buttons',
			[
				{
					text: "Stay Here",
					click: function(e) {
						$.DirtyForms.choiceContinue = false;
						$(this).dialog('close');
					}
				},
				{
					text: "Leave This Page",
					click: function(e) {
						$.DirtyForms.choiceContinue = true;
						$(this).dialog('close');
					}
				}
			] 
		).bind('dialogclose', function(e) {
			// Execute the choice after the modal dialog closes
			$.DirtyForms.choiceCommit(e);
		});
	},
	refire: function(content) {
		return false;
	},
	stash: function() {
		return false;
	}
}
```

Note that calling *$.DirtyForms.choiceContinue = false;* isn't strictly necessary as false is the default, but is shown in the example to make it more clear. Also note that a choice will always be committed using this method whether the user clicks a button or uses the "X" icon to close the dialog because 'dialogclose' is called in every case the dialog is closed.

The *$.DirtyForms.choiceCommit()* method automatically calls either *$.DirtyForms.decidingCancel()* or *$.DirtyForms.decidingContinue()* depending on the state of *$.DirtyForms.choiceContinue*, so there is no need to call them manually.

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
**decidingcancelled.dirtyforms**: Raised when the *decidingCancel()* method is called before it runs any actions.

**decidingcancelledAfter.dirtyforms**: Raised when the *decidingCancel()* method is called after it runs all actions.

**decidingcontinued.dirtyforms**: Raised when the *decidingContinue()* method is called before it runs any actions.

**choicecommit.dirtyforms**: Raised when the *choiceCommit* method is called before it runs any actions.

**choicecommitAfter.dirtyforms**: Raised when the *choiceCommit* method is called after it runs all actions.

**defer.dirtyforms**: Raised prior to showing the dialog box to the user.

**beforeRefire.dirtyforms**: Raised before the original event is refired after a user chooses to leave the page.


You can attach callbacks to the **decidingcancelled.dirtyforms** and **decidingcontinued.dirtyforms** custom events. These events are called when the cancel, or continue method on the modal dialog is called (when the user clicks either continue, or cancel).

These triggers are not available when used with the browser fallback dialog method.

Also available is **defer.dirtyforms** for accessing elements on the page prior to the dialog box alerting the user is called, and **beforeRefire.dirtyforms**, called before the original event is refired after a user chooses to leave the page (useful if you need to do things like save data back to fields which is normally part of event propagation - ala tinyMce).

Selectors
---------------------------------

**:dirty** will select all elements with the dirty class attached. form:dirty would be all forms that are currently dirty for example.

**:dirtylistening** will select all elements that has the listening class attached. This should be all forms that are currently listening for change

Contributors
---------------------------------

[Mal Curtis (snikch)](https://github.com/snikch)

[Shad Storhaug (NightOwl888)](https://github.com/NightOwl888)

[Mark Campbell (Nitrodist)](https://github.com/Nitrodist)

[ssmiley483](https://github.com/ssmiley483)

[Greg (gmcrist)](https://github.com/gmcrist)

[Samuel (hleumas)](https://github.com/hleumas)


