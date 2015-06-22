[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

Dirty Forms is a jQuery plugin to help prevent users from losing data when editing forms.

Dirty Forms will alert a user when they attempt to leave a page without submitting a form they have entered data into. It alerts them in a modal popup box, and also falls back to the browser's default onBeforeUnload handler for events outside the scope of the document such as, but not limited to, page refreshes and browser navigation buttons.

Oh, and it's pretty easy to use.

```javascript
$('form').dirtyForms();
```

Existing solutions were not flexible enough, so I wrote this to make sure that all of our use cases at Learnable would be supported. This included using TinyMCE as a rich text editor and ensuring dirty tinymce instances mark their form as dirty. I've also ensured that event bubbling on links and forms are propagated correctly. Dirty Forms will only attempt to alert the user if the event has not had the preventDefault() method called, and will accordingly refire events if the user chooses to continue from the page - ensuring all click handlers, and form submission handlers are correctly fired. For this reason, Dirty Forms should be the last jQuery plugin included, as it needs to be the last bound handler in the event stack.

The jQuery .on() method (or .delegate() method in jQuery prior to version 1.7) is used to attach click and submit handlers so even elements that are introduced to the page after the page has loaded, e.g. loaded dynamically through AJAX, will be handled correctly, and a 'form stash' was created to capture and save event targets at the beginning of the event / decision stage so that elements that are no longer in the DOM can still have events fired on them (e.g. when a form is in a modal box, then the modal box is replaced by the Dirty Forms confirmation, the form will be stashed, and if the event is refired, it will be added back to the DOM then have the event triggered on it).

Prerequisites
---------------------------------
- [jQuery](http://jquery.com) (>= 1.4.2)
- [jquery.facebox](https://github.com/NightOwl888/facebox) (>= 1.2.0) 

**NOTE:** If you set `$.DirtyForms.dialog = false;`, you can remove facebox as a prerequisite. See the [Dialogs](#dialogs) section for details about interoperability with other dialogs.

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
Dirty Forms is available over jsDelivr CDN and can directly included to every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/1.1.0/jquery.dirtyforms.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, jquery.facebox, and jquery.dirtyforms in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.facebox,jquery.dirtyforms@1.1.0"></script>
```

#### Self-Hosted
Download and save one of two available files to include Dirty Forms to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dist/master/jquery.dirtyforms.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dist/master/jquery.dirtyforms.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
Dirty Forms is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the helper, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.svg)](http://www.npmjs.org/package/jquery.dirtyforms)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.svg)](http://bower.io/search/?q=jquery.dirtyforms)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.svg)](https://www.nuget.org/packages/jquery.dirtyforms/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms/)
```
// NPM
$ npm install jquery.dirtyforms

// Bower
$ bower install jquery.dirtyforms

// NuGet
PM> Install-Package jquery.dirtyforms
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

####CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/1.1.0/jquery.dirtyforms.min.js.map"></script>
```

#### Package Managers

NPM or Bower will install the file into the destination directory.

```
jquery.dirtyforms.min.js.map
```

For NuGet, this file is not included in the package, but you can get it from [here](https://github.com/NightOwl888/jquery.dirtyforms.dist/blob/master/jquery.dirtyforms.min.js.map) if you really need it.


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

#### Available Helpers

- [Always Dirty](https://github.com/NightOwl888/jquery.dirtyforms.helpers.alwaysdirty.dist#readme)
- [CKEditor](https://github.com/NightOwl888/jquery.dirtyforms.helpers.ckeditor.dist#readme)
- [TinyMCE](https://github.com/NightOwl888/jquery.dirtyforms.helpers.tinymce.dist#readme)

#### Documentation for Rolling-Your-Own Helper

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

Simply bind a function to any of these hooks to respond to the corresponding trigger.

```javascript
$(document).bind('choicecommit.dirtyforms', function() { 
    ...stuff to do before commiting the user's choice... 
});
```

**decidingcancelled.dirtyforms**: Raised when the *decidingCancel()* method is called before it runs any actions.

**decidingcancelledAfter.dirtyforms**: Raised when the *decidingCancel()* method is called after it runs all actions.

**decidingcontinued.dirtyforms**: Raised when the *decidingContinue()* method is called before it runs any actions.

**choicecommit.dirtyforms**: Raised when the *choiceCommit* method is called before it runs any actions.

**choicecommitAfter.dirtyforms**: Raised when the *choiceCommit* method is called after it runs all actions.

**defer.dirtyforms**: Raised prior to showing the dialog box to the user.

**beforeRefire.dirtyforms**: Raised before the original event is refired after a user chooses to leave the page.

**beforeunload.dirtyforms**: Non-cancelable event, raised prior leaving the page which may happen either as result of user selection if forms were dirty, or due to a normal page exit of no changes were made.


You can attach callbacks to the **decidingcancelled.dirtyforms** and **decidingcontinued.dirtyforms** custom events. These events are called when the cancel, or continue method on the modal dialog is called (when the user clicks either continue, or cancel).

These triggers are not available when used with the browser fallback dialog method.

Also available is **defer.dirtyforms** for accessing elements on the page prior to the dialog box alerting the user is called, and **beforeRefire.dirtyforms**, called before the original event is refired after a user chooses to leave the page (useful if you need to do things like save data back to fields which is normally part of event propagation - ala tinyMce).

Selectors
---------------------------------

**:dirty** will select all elements with the dirty class attached. form:dirty would be all forms that are currently dirty for example.

**:dirtylistening** will select all elements that has the listening class attached. This should be all forms that are currently listening for change



