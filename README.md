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

## Features

- Works on forms of any size.
- Wide browser support.
- Works with your existing dialog framework for the best user experience (optional).
- Falls back to the browser's dialog (if the browser supports it).
- Pluggable helper system that reads and updates the dirty state of common rich text editor frameworks (optional).
- Small size (about 6k when minified).
- Universal Module Definition (UMD) support for AMD, JSCommon, Browserify, etc.
- Hosted on jsDelivr CDN for easy combining of modules into a single HTTP request.

## Supported Browsers

- IE 8+
- Google Chrome (all versions since 2010)
- Firefox 4+
- Safari 5+

## Prerequisites

- [jQuery](http://jquery.com) (>= 1.4.2)
- [jquery.facebox](https://github.com/NightOwl888/facebox) (>= 1.2.0) 

**NOTE:** If you set `$.DirtyForms.dialog = false;`, you can remove facebox as a prerequisite. See the [Dialogs](#dialogs) section for details about interoperability with other dialogs.

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
Dirty Forms is available over jsDelivr CDN and can directly included to every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/1.2.0/jquery.dirtyforms.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, jquery.facebox, and jquery.dirtyforms in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.facebox,jquery.dirtyforms@1.2.0"></script>
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
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/1.2.0/jquery.dirtyforms.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.min.js.map
```

## Usage

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

## Ignoring Things

Simply add the value of `$.DirtyForms.ignoreClass` to any elements you wish to ignore, and Dirty Forms will ignore them.

```javascript
$('#ignored-element').addClass($.DirtyForms.ignoreClass);
```

If you want to ignore more than one element at a time, you can add the value of `$.DirtyForms.ignoreClass` (with the default value `dirtyignore`) to a containing element.

```HTML
<div class="dirtyignore">

    <!-- Everything here will be ignored - anchor, input, textarea, and select -->

</div>
```

And of course that means if you ignore the topmost element on the page, you will effectively disable Dirty Forms.

```
$('html').addClass($.DirtyForms.ignoreClass);
```

You can re-enable elements so Dirty Forms watches them again simply by removing the ignore class.

```
$('html').removeClass($.DirtyForms.ignoreClass);
```

## Options

The following options are available to set via **$.DirtyForms.OPTIONNAME = OPTIONVALUE** or get via **OPTIONVALUE = $.DirtyForms.OPTIONNAME**

| Name  | Type  | Default  | Description  |  
|---|---|---|---|
| **title**  | string  | `Are you sure you want to do that?`  | Sets the title of the dialog (JavaScript/CSS dialog only).  |  
| **message**  | string  | `You've made changes on this page which aren't saved. If you leave you will lose these changes.`  | Sets the message of the dialog (whether JavaScript/CSS dialog or the browser's built in dialog - note that some browsers do not show this message).   |   
| **ignoreClass**  | string  | `ignoredirty` | The CSS class applied to elements that you wish to be ignored by Dirty Forms. This class can also be applied to container elements (such as `<div>` or `<form>`) to ignore every element within the container.  |  
| **dirtyClass**  | string  | `dirty`  | The class applied to elements and forms when they're considered dirty. Note you can use this to style the elements to make them stand out if they are dirty (or for debugging).  |  
| **listeningClass**  | string  | `dirtylisten`  | The class applied to elements that are having their inputs monitored for change.  |  
| **choiceContinue**  | bool  | `false`  | Set to true from the dialog to indicate to continue execution of the link or button that was clicked or false to cancel. Execution of the choice will be deferred until `choiceCommit()` is called.  |  
| **helpers** | string  | `[]`  | An array for helper objects. See [Helpers](#helpers) below.  |  
| **dialog**  | string  | A Facebox dialog object  | An object that will be used to fire the JavaScript/CSS dialog. See [Dialogs](#dialogs) below.  |  
| **debug**  | bool  | `false`   | Set to true to log messages to the console (or firebug). If your browser doesn't support this, there will be alerts instead.  |  

> **NOTE:** **debug** is not available in the minified version. If you need to turn this on, be sure to switch the file reference to the uncompressed `jquery.dirtyforms.js` file. 

## Public Methods

#### ```$.DirtyForms.isDirty()```

Returns true if any watched elements (that are not ignored) are considered dirty.


#### ```$('form#my-watched-form').dirtyForms()```

Starts watching the supplied elements (forms) for descendant input changes. To watch all forms, simply use the `'form'` selector.

```javascript
$('form').dirtyForms();
```


#### `var isDirty = $('form#my-watched-form').dirtyForms('isDirty')`

Returns true if the provided element is considered dirty.


#### `$('form#my-watched-form').dirtyForms('setDirty')`

Marks the provided element as dirty by adding the `dirtyClass`. If the element is within a form, the form is also marked dirty with the `dirtyClass`.


#### `$('form#my-watched-form').dirtyForms('setClean')`

Marks the provided form or element as clean. In other words, removes the `dirtyClass`. If the operation marks all elements within a form clean, it will also mark the form clean.


#### `$.DirtyForms.choiceCommit( event )`

This method should be called after the dialog is closed to commit the choice that was specified in *$.DirtyForms.choiceContinue*. This method will cascade the call to either `$.DirtyForms.decidingContinue()` or `$.DirtyForms.decidingCancel()` automatically, so there is no need to use them in conjunction with this method. An event object is required to be passed as a parameter. See the [Dialogs](#dialogs) section for an example of how to use this method.


#### `$.DirtyForms.decidingContinue( event )`

This method should be called from the dialog to refire the event and continue following the link or button that was clicked. An event object is required to be passed as a parameter.


#### `$.DirtyForms.decidingCancel( event )`

This method should be called from the dialog to indicate not to move on to the page of the button or link that was clicked. An event object is required to be passed as a parameter. Note that this method will automatically cancel the event.


#### `$.DirtyForms.isDeciding()`

This method will return true if the dialog has fired and neither `$.DirtyForms.decidingCancel()` or `$.DirtyForms.decidingContinue()` has yet been called.


#### `$('form#my-watched-form').isDirty()` (Deprecated)

Please use `$('form#my-watched-form').dirtyForms('isDirty')` instead.


#### `$('form#my-watched-form').setDirty()` (Deprecated)

Please use `$('form#my-watched-form').dirtyForms('setDirty')` instead.


#### `$('form#my-watched-form').cleanDirty()` (Deprecated)

Please use `$('form#my-watched-form').dirtyForms('setClean')` instead.


#### `$.DirtyForms.disable()` (Deprecated)

Please use `$('html').addClass($.DirtyForms.ignoreClass)` instead.

## Triggers

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

-----

You can attach callbacks to the **decidingcancelled.dirtyforms** and **decidingcontinued.dirtyforms** custom events. These events are called when the cancel, or continue method on the modal dialog is called (when the user clicks either continue, or cancel).

These triggers are not available when used with the browser fallback dialog method.

Also available is **defer.dirtyforms** for accessing elements on the page prior to the dialog box alerting the user is called, and **beforeRefire.dirtyforms**, called before the original event is refired after a user chooses to leave the page (useful if you need to do things like save data back to fields which is normally part of event propagation - ala tinyMce).

## Selectors

**:dirty** will select all elements with the dirty class attached. form:dirty would be all forms that are currently dirty for example.

**:dirtylistening** will select all elements that has the listening class attached. This should be all forms that are currently listening for change.


## Helpers

Dirty Forms was created because the similar plugins that existed were not flexible enough. To provide more flexibility a basic helper framework has been added. With this, you can add in new helper objects which will provide additional ability to check for whether a form is dirty or not.

This is useful when you're using replacement inputs or textarea, such as with TinyMCE or CKEditor. See [Available Helpers](#available-helpers).

#### Available Helpers

- [Always Dirty](https://github.com/NightOwl888/jquery.dirtyforms.helpers.alwaysdirty.dist#readme)
- [CKEditor](https://github.com/NightOwl888/jquery.dirtyforms.helpers.ckeditor.dist#readme)
- [TinyMCE](https://github.com/NightOwl888/jquery.dirtyforms.helpers.tinymce.dist#readme)

#### Custom Helpers

Helpers can be created by implementing and then pushing the helper to the `$.DirtyForms.helpers` array.

```javascript
$.DirtyForms.helpers.push(myHelper);
```

##### Members (All Optional)

#### `isDirty( form )`

Should return the dirty status of the helper. You can use jQuery to select all of the helpers within the form and test their dirty status.

```javascript
isDirty: function (form) {
	var isDirty = false;
	
	// Search for all tinymce elements inside the given form
	$(form).find(':tinymce').each(function () {

		if ($(this).tinymce().isDirty()) {
			isDirty = true;
			return true;
		}
		
	});
	
	return isDirty;
}
```


#### `setClean( form )`

Should reset the dirty status of the helper so `isDirty(form)` will return false the next time it is called.

```javascript
setClean: function (form) {

	// Search for all tinymce elements inside the given form
	$(form).find(':tinymce').each(function () {
		if ($(this).tinymce().isDirty()) {
			//Force not dirty state
			$(this).tinymce().isNotDirty = 1; 
		}
	});

}
```

#### `ignoreAnchorSelector` (Property)

A jQuery selector of any anchor elements to exclude from activating the dialog. Non-anchors will be ignored. This works similarly to putting the ignoreClass on a specific anchor, but will always ignore the anchors if your helper is included.

```javascript
ignoreAnchorSelector: '.mceEditor a,.mceMenu a'
```

To respect the way jQuery selectors work, all children of the form as well as the form itself should have your custom `isDirty()` and `setClean()` logic applied.


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

See the [TinyMCE Helper Source Code](https://github.com/snikch/jquery.dirtyforms/blob/master/jquery.dirtyforms/helpers/tinymce.js) for another complete example.

## Dialogs

The default facebox dialog can be overriden by setting a new dialog object, and providing implementations for the following members.

#### `fire(message, title)` (Required)

Opens the dialog.

##### message

The main message to show in the dialog.

##### title

The title for the header of the dialog.


#### `bind()` (Optional)

Binds the continue and cancel functions to the correct links. For some dialog frameworks, it is simpler just to do all of the work in the fire function. In that case, this function can be omitted. Note that this function is called immediately after fire is called.

It is important to trap the `ESC` key (character code 27) in the keydown event in order to ensure it doesn't cause erratic behavior.

```javascript
// Trap the escape key and force a close. 
// Cancel it so the dialog framework doesn't intercept it.
$(document).keydown(function(e) {

	// Look for the ESC key
	if (e.keyCode == 27) {
	
		// Cancel the event so it doesn't bubble
		e.preventDefault();
		
		// Close the dialog
		dlg.dialog('close');
		
		// Cancel the decision
		$.DirtyForms.decidingCancel(e);
		
		// Return false
		return false;
	}
	
	// Make sure you don't return false here
});
```


#### `stash()` (Optional)

Stash returns the current contents of a dialog to be refired after the confirmation. Use to store the current dialog (from the application), when it's about to be replaced with the confirmation dialog. This function can be omitted (or return false) if you don't wish to stash anything.

See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `refire(content, ev)` (Optional)

Refire handles closing an existing dialog AND fires a new one. You can omit this method (or return false) if you don't need to use stashing/refiring.

See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `selector` (Optional Property)

A jQuery selector used to select the element that will be cloned and put into the stash. This should be a class or id of a modal dialog with a form in it, not the dialog that Dirty Forms will show its confirmation message in.

See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `continueButtonText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the text of the continue button.

If contributing a new dialog module, please include this property and set the default value to `Leave This Page`.


#### `cancelButtonText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the text of the cancel button.

If contributing a new dialog module, please include this property and set the default value to `Stay Here`.


#### `width` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the width of the dialog (if the dialog framework supports setting the width through JavaScript).


#### `class` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the class of the outermost element of the dialog. This can make it easy for the end user to style the dialog with CSS. Omit this setting if the dialog framework is using themes, since it doesn't make sense to override styles of an existing theme.

#### Dialog Example

```javascript
// Selector is a selector string for dialog content. 
// Used to select the element that will be cloned and put into the stash.
selector : '#facebox .content',

// Fire starts the dialog
fire : function(message, title){
	var content = '<h1>' + title + '</h1><p>' + message + '</p>' + 
		'<p>' +
			'<a href="#" class="' + $.DirtyForms.ignoreClass + ' continue">Continue</a>' +
			'<a href="#" class="' + $.DirtyForms.ignoreClass + ' cancel">Stop</a>' +
		'</p>';
	$.facebox(content);
},

// Bind binds the continue and cancel functions to the correct links. For some dialog
// frameworks, it is simpler just to do all of the work in the fire function.
// In that case, this function can be omitted. Note that this function is called immediately
// after fire is called.
bind : function(){
	$(document).bind('keydown.facebox', function (e) {
		// Intercept the escape key and send the event to Dirty Forms
		if (e.keyCode === 27) {
			$(document).trigger('close.facebox');
            $.DirtyForms.decidingCancel(e);
		}
	});
	$('#facebox .cancel, #facebox .close').click($.DirtyForms.decidingCancel);
	$('#facebox .continue').click($.DirtyForms.decidingContinue);
	$(document).bind('decidingcancelled.dirtyforms', function(){
		$(document).trigger('close.facebox');
	});
},

// Stash returns the current contents of a dialog to be refired after the confirmation
// Use to store the current dialog, when it's about to be replaced with the confirmation dialog.
// This function can be omitted (or return false) if you don't wish to stash anything.
stash : function(){
	var fb = $('#facebox .content');
	return ($.trim(fb.html()) == '' || fb.css('display') != 'block') ?
	   false :
	   fb.clone(true);
}

// Refire handles closing an existing dialog AND fires a new one.
// You can omit this method (or return false) if you don't need to use stashing/refiring.
refire : function(content){
	var rebox = function(){
		$.facebox(content);
		$(document).unbind('afterClose.facebox', rebox);
	}
	$(document).bind('afterClose.facebox', rebox);
},

```

`fire()` accepts a `message` and `title`, and is responsible for creating the modal dialog. Note the two classes on each link. In the `bind()` method you will see that we bind the `$.DirtyForms.decidingCancel(e)` method to the `.cancel` link and the `.close` link, and we bind `$.DirtyForms.decidingContinue(e)` to the `.continue` link. You should bind both `$.DirtyForms.decidingCancel` and `$.DirtyForms.decidingContinue` in the `bind()` method (or alternatively you can create the entire dialog in the `fire()` method).

> Be sure to register the keydown event for the escape key and pass the call on to `$.DirtyForms.decidingCancel(e)` or the default browser fallback will fail when the user hits the escape key.

Alternatively, another pattern is supported for modal dialogs where the continuing execution of the event is not allowed until after the dialog is closed (such as when using jQuery UI dialog in modal mode). The pattern uses a boolean property named `$.DirtyForms.choiceContinue` to indicate the dialog choice and a method named `$.DirtyForms.choiceCommit(e)` to execute the choice. Here is an example of that pattern in action using a modal jQuery UI dialog:

```javascript
$.DirtyForms.dialog = {
	selector: '#unsavedChanges',
	fire: function(message, dlgTitle) {
		$('#unsavedChanges').dialog({title: dlgTitle, width: 400, modal: true});
		$('#unsavedChanges').html(message);
	},
	bind: function() {
		$('#unsavedChanges').dialog('option', 'buttons',
			[
				{
					text: "Leave This Page",
					click: function(e) {
						$.DirtyForms.choiceContinue = true;
						$(this).dialog('close');
					}
				},
				{
					text: "Stay Here",
					click: function(e) {
						$.DirtyForms.choiceContinue = false;
						$(this).dialog('close');
					}
				}
			] 
		).bind('dialogclose', function(e) {
			// Execute the choice after the modal dialog closes
			$.DirtyForms.choiceCommit(e);
		});

		// Intercept the escape key and cancel the event.
		// Calling dialog('close') will fire the 'dialogclose' event,
		// which will in turn commit the choice to Dirty Forms.
		$(document).bind('keydown', function(e) {
			if (e.keyCode == 27) {
				e.preventDefault();
				$.DirtyForms.choiceContinue = false;
                $('#unsavedChanges').dialog('close');
            }
        });
	}
}

// Dynamically add the div element to the page for the dialog (a hidden div).
$('body').append("<div id='unsavedChanges' style='display: none'></div>");
        
```

Note that calling `$.DirtyForms.choiceContinue = false;` isn't strictly necessary as `false` is the default, but is shown in the example to make it more clear. Also note that a choice will always be committed using this method whether the user clicks a button or uses the "X" icon to close the dialog because the `'dialogclose'` event is called in every case the dialog is closed.

The `$.DirtyForms.choiceCommit()` method automatically calls either `$.DirtyForms.decidingCancel()` or `$.DirtyForms.decidingContinue()` depending on the state of `$.DirtyForms.choiceContinue`, so there is no need to call them manually.

If you don't want to use a dialog at all, simply pass in `false` instead of an object. Dirty Forms will then use the default browser dialog.

```javascript
$.DirtyForms.dialog = false;
```

### Modal Dialog Stashing

Stashing is meant for the following scenario.

1. A form is hosted inside a modal dialog.
2. The dialog framework you use doesn't allow overlaying a modal dialog on top of another modal dialog.

You don't need to use stashing if either of the above (or both) of the items don't apply to you.

If you have a form and link which is in a modal dialog (a modal dialog created by some other part of your application) then when the Dirty Forms modal fires, the original modal is removed. So the stash saves the content from the original modal dialog while Dirty Forms shows its modal dialog, and then re-shows the original modal dialog with the edits if the user chooses to stay on the page.
