[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

Dirty Forms is a jQuery plugin to help prevent users from losing data when editing forms.

Dirty Forms will alert a user when they attempt to leave a page without submitting a form they have entered data into. It alerts them in a modal popup box, and also falls back to the browser's default onBeforeUnload handler for events outside the scope of the document such as, but not limited to, page refreshes and browser navigation buttons.

Oh, and it's pretty easy to use.

```javascript
$('form').dirtyForms();
```
Existing solutions were not flexible enough, so Dirty Forms was created to support a wider range of scenarios including support for dynamically added inputs and forms, TinyMCE and CKEditor rich text editor "dirtyness" support, custom widget "dirtyness" support, interoperability with any dialog framework (or the browser's built-in dialog), a "stash" that can be used in cases where dialogs don't have stacking support and you want to have a form inside of a dialog, and correct handling of events to refire when the user decides to proceed to an off-page destination.

## Features

- NO dependencies (except for jQuery of course).
- Supports multiple forms.
- Works on forms of any size.
- Wide browser support.
- Advanced state management - tracks the original values of fields so they are "clean" when reset to the original value.
- Works with your existing dialog framework for the best user experience (optional).
- Falls back to the browser's dialog (if the browser supports it).
- Pluggable helper system that reads and updates the dirty state of custom widgets and common rich text editor frameworks (optional).
- Event handler customization (for IFrame support).
- Small size (about 2.5 KB gzipped).
- Universal Module Definition (UMD) support for AMD, Node/CommonJS, Browserify, etc.
- Hosted on jsDelivr CDN for easy combining of modules into a single HTTP request.

## Supported Browsers

- IE 8+
- Google Chrome 1+
- Firefox 4+
- Safari 5+

## Prerequisites

- [jQuery](http://jquery.com) (>= 1.4.2)

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation

> Dirty Forms should be the last jQuery plugin included in the page, as it needs to be the last bound handler in the event stack (except of course for Dirty Forms [helpers](#helpers) and [dialog modules](#dialogs)).

There are several different ways to get the code. Some examples below:

#### CDN
Dirty Forms is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery and jquery.dirtyforms in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.dirtyforms@2.0.0"></script>
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

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.min.js.map
```

## Usage

```javascript
$(function() {

	// Enable for all forms.
	$('form').dirtyForms();

	// Enable for just forms of class 'sodirty'.
	$('form.sodirty').dirtyForms();

	// Customize the title and message.
	// Note that title is not supported by browser dialogs, so you should 
	// only set it if you are using a custom dialog or dialog module.
	$('form').dirtyForms({ 
		dialog: { title: 'Wait!' }, 
		message: 'You forgot to save your details. If you leave now, they will be lost forever.' 
	});

	// Enable Debugging (non-minified file only).
	$('form').dirtyForms({ debug: true });

	// Check if anything inside a div with CSS class watch is dirty.
	if ($('div.watch').dirtyForms('isDirty')) {
		// There was something dirty inside of the div
	}

	// Select all forms that are dirty, and set them clean.
	// This will make them forget the current dirty state and any changes
	// after this call will make the form dirty again.
	$('form:dirty').dirtyForms('setClean');

	// Rescan to sync the dirty state with any dynamically added forms/fields
	// or changes to the ignore state. This comes in handy when styling fields
	// with CSS that are dirty.
	$('form').dirtyForms('rescan');

	// Select all forms that are listening for changes.
	$('form:dirtylistening');

	// Enable/disable the reset and submit buttons when the state transitions
	// between dirty and clean. You will need to first set the initial button
	// state to disabled (either in JavaScript or by setting the attributes in HTML).
	$('form').find('[type="reset"],[type="submit"]').attr('disabled', 'disabled');
	$('form').on('dirty.dirtyforms clean.dirtyforms', function (ev) {
        var $form = $(ev.target);
        var $submitResetButtons = $form.find('[type="reset"],[type="submit"]');
        if (ev.type === 'dirty') {
            $submitResetButtons.removeAttr('disabled');
        } else {
            $submitResetButtons.attr('disabled', 'disabled');
        }
    });

	// Add a form dynamically and begin tracking it.
	var $form = $('<form action="/" id="watched-form" method="post">' +
		'<input id="inputa" type="text" />' +
		'<button id="submita" type="submit" value="Submit">Submit</button>' +
		'</form>');
	$('body').append($form);
	$form.dirtyForms();

});

```

## Setting a Form Dirty Manually

> **NOTE:** This example shows how to set the state of a form dirty. However, it is generally recommended that each of the widgets (whether built by you or a 3rd party) have their own dirty/clean state. Instead of "pushing" the dirty state into Dirty Forms, you should aim to allow Dirty Forms to read the dirty state of each widget using one or more custom helpers. You can then opt to make each widget "undo" its dirty state when the user reverts their edits in the widget, which will provide a better user experience and make it similar to the rest of Dirty Forms state management behavior.

In version 1.x, there was a `setDirty` method that allowed you to set the form dirty manually. In version 2.x, this method has been removed since this functionality is effectively a duplication of what a custom helper does. It is now recommended that you create a custom helper to set a form dirty manually. You will need to attach a piece of data to the form to track whether it is dirty. In this example, we use a CSS class `mydirty` for this purpose. Note that this class should not be the same value as `$.DirtyForms.dirtyClass` because Dirty Forms automatically removes this value when the user undoes their edits (which is probably not the behavior you are after).

```
$('#watched-form').dirtyForms({
    helpers:
        [
            {
                isDirty: function ($node, index) {
                    if ($node.is('form')) {
                        return $node.hasClass('mydirty');
                    }
                }
            }
        ]
});
```

You can then use the jQuery [`addClass`](https://api.jquery.com/addclass/) and [`removeClass`](https://api.jquery.com/removeclass/) methods to get the same behavior as version 1.x.

```
function setDirty() {
    $('#watched-form').addClass('mydirty');
}

function setClean() {
    $('#watched-form').removeClass('mydirty');
}
```

Or, you can improve the behavior of `setClean` by instead implementing the [`setClean` helper method](https://github.com/snikch/jquery.dirtyforms#setclean-node-index-excludeignored--optional) as needed by your application so it is automatically reset to clean when the [`dirtyForms('setClean')` method](https://github.com/snikch/jquery.dirtyforms#dirtyforms-setclean-excludeignored-excludehelpers-) is called.

```
$('#watched-form').dirtyForms({
    helpers:
        [
            {
                isDirty: function ($node, index) {
                    if ($node.is('form')) {
                        return $node.hasClass('mydirty');
                    }
                },
				setClean: function($node, index, excludeIgnored) {
					if ($node.is('form')) {
						$node.removeClass('mydirty');
					}
				}
            }
        ]
});
```

In that case, calling `$('#watched-form').dirtyForms('setClean')` will set both the fields/forms that are tracked by Dirty Forms and your custom `mydirty` class to a non-dirty state in one method call instead of having to call your custom `setClean` method separately.

> **NOTE:** `dirtyForms('setClean')` is called automatically when a reset button is clicked by the user on a particular form.

## Ignoring Things

Set the `ignoreSelector` option to ignore specific fields, anchors, or buttons.

```
$('form').dirtyForms({ ignoreSelector: 'a.ignore-me' });
```

Alternatively, add the value of `$.DirtyForms.ignoreClass` to any elements you wish to ignore, and Dirty Forms will ignore them.

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

### Default Anchor Ignoring Behavior

The default behavior ignores anchor tags under the following scenarios. If you want an anchor to be ignored for any other purpose, you should use the `ignoreClasss` either on the anchor itself or an ancestor container. The default behavior can be changed by overriding the event handling (see [Event Handler Customization](#event-handler-customization)).

#### `target="_blank"`

If the target is a blank browser window, we assume that the page is not going to reload because (at least in theory) a new browser or tab will open. Note that if the target attribute is changed dynamically, the anchor tag will automatically be un-ignored.

```html
<a href="http://www.google.com" target="_blank">Go to Google</a>
```

#### onClick `return false;`

If the onClick event returns `false`, the click will be ignored by Dirty Forms.

```html
<a href="http://www.google.com" onclick="alert('This click is ignored');return false;">Go to Google</a>
```

> **NOTE:** Due to a bug in jQuery < 1.5, Dirty Forms will not ignore anchors in this case, so you will need to use the `ignoreClass` instead.

#### `.preventDefault()` is Called

If the click event handler calls `.preventDefault()` on its event, Dirty Forms will ignore the click.

```html
<a id="google-link" href="http://www.google.com">Go to Google</a>
```
```javascript
$('#google-link').click(function (event) {
    // Cancel the default browser action
	event.preventDefault();
});
```

> **NOTE:** Anchor tags with no HREF were ignored in previous versions of Dirty Forms, but now these tags are included by default. We can't make any assumptions about what an anchor tag does whether or not it has an HREF tag. If you want to ignore them by default, add the `ignoreSelector: 'a:not([href])'`. 

## Options

The following options are available to set during declaration of `.dirtyForms()` or alternatively via **$.DirtyForms.OPTIONNAME = OPTIONVALUE** or get via **OPTIONVALUE = $.DirtyForms.OPTIONNAME**.

```javascript
$('form').dirtyForms({ message: 'Doh! You forgot to save.' });

// OR

$.DirtyForms.message = 'Doh! You forgot to save.';
```

| Name  | Type  | Default  | Description  |  
|---|---|---|---|
| **message**  | string  | `You've made changes on this page which aren't saved. If you leave you will lose these changes.`  | Sets the message of the dialog (whether JavaScript/CSS dialog or the browser's built in dialog - note that some browsers do not show this message).   |   
| **dirtyClass**  | string  | `dirty`  | The class applied to elements and forms when they're considered dirty. Note you can use this to style the elements to make them stand out if they are dirty (or for debugging).  |  
| **listeningClass**  | string  | `dirtylisten`  | The class applied to elements that are having their inputs monitored for change.  |  
| **ignoreClass**  | string  | `dirtyignore` | The CSS class applied to elements that you wish to be ignored by Dirty Forms. This class can also be applied to container elements (such as `<div>` or `<form>`) to ignore every element within the container.  |  
| **ignoreSelector**  | string  | `''` | A jQuery selector that can be set to ignore specific elements.  |  
| **fieldSelector**  | string  | `input:not([type='button'],[type='image'],[type='submit'],[type='reset'],[type='file'],[type='search']),select,textarea` | A jQuery selector indicating which input fields to include in the scan. |  
| **helpers** | Array  | `[]`  | An array for helper objects. See [Helpers](#helpers) below.  |  
| **dialog**  | object  | `false`  | An object that will be used to fire the JavaScript/CSS dialog. A `false` setting indicates to always use the browser's dialog. See [Dialogs](#dialogs) below.  |  
| **debug**  | boolean  | `false`   | Set to `true` to log messages to the console (or firebug). If your browser doesn't support this, there will be alerts instead.  |  

> **NOTE:** **debug** is not available in the minified version. If you need to turn this on, be sure to switch the file reference to the uncompressed `jquery.dirtyforms.js` file. 

## Public Methods

#### ```.dirtyForms( options )```

Initializes Dirty Forms, overrides any of the default options, and stores the original values of the fields of all of the forms that match or are descendants of the selector. The `scan.dirtyforms` event is triggered for each form that is found. To scan all forms, simply use the `'form'` selector.

```javascript
$('form').dirtyForms();
```

##### `options` (Optional)

An options object.

```javascript
$('form').dirtyForms({ message: 'You better save first.', dirtyClass: 'sooooooo-dirty'});
```

> For a list of available options, see [Options](#options).


#### `.dirtyForms( 'isDirty', excludeHelpers )`

Returns `true` if any non-ignored elements that match or are descendants of the selector are dirty.

##### `excludeHelpers` (Optional)

Set to `true` to exclude helpers from the operation. The default is `false`.


#### `.dirtyForms( 'setClean', excludeIgnored, excludeHelpers )`

Marks all fields that match the selector (or are descendants of the selector) clean. Also calls the `setClean` method of all nested helpers. In other words, removes the `dirtyClass` and resets the state so any changes from the current point will cause the form to be dirty. If the operation marks all elements within a form clean, it will also mark the form clean even if it is not included in the selector.

##### `excludeIgnored` (Optional)

Set to `true` to exclude ignored fields from the operation. The default is `false`.

##### `excludeHelpers` (Optional)

Set to `true` to exclude helpers from the operation. The default is `false`.


#### `.dirtyForms( 'rescan', excludeIgnored, excludeHelpers )`

Scans all fields that match the selector (or are descendants of the selector) and stores their original values of any dynamically added fields. Also calls the `rescan` method of all nested helpers. Ignores any original values that had been set previously during prior scans or the `.dirtyForms('setClean')` method. Also synchronizes the dirty state of fields with any changes to the ignore status, which can be helpful if you are styling elements differently if they have the dirty class.

##### `excludeIgnored` (Optional)

Set to `true` to exclude ignored fields from the operation. The default is `false`.

##### `excludeHelpers` (Optional)

Set to `true` to exclude helpers from the operation. The default is `false`.


## Events

#### Form Events

Simply bind a function to any of these hooks to respond to the corresponding event. The form that triggered the event can be accessed through the `event.target` property.

```javascript
$(document).bind('dirty.dirtyforms', function(event) { 
	// Access the form that triggered the event
    var $form = $(event.target);
});

// Or, bind to a specific form to listen for the event
$('form#my-form').bind('dirty.dirtyforms', function () {
	// Access the form that triggered the event
    var $form = $(this);
});
```

| Name  | Parameters  |  Description  |  
|---|---|---|
| **dirty.dirtyforms**  | event  | Raised when a form changes from clean state to dirty state.  |
| **clean.dirtyforms**  | event  | Raised when a form changes from dirty state to clean state. This may happen when the last element within the form is marked clean using `$('#element-id').dirtyForms('setClean')` or when the user undoes all of their edits.  |
| **scan.dirtyforms**  | event  | Raised after the form is scanned for new fields (whether during initialization or when subsequently calling `.dirtyForms()`). |
| **rescan.dirtyforms**  | event  | Raised after the form is rescanned for new fields (when calling `.dirtyForms('rescan')`).  |
| **setclean.dirtyforms**  | event  | Raised after the `.dirtyForms('setClean')`) method is called or when the user clicks the `reset` button.  |



#### Document Events

Simply bind a function to any of these hooks to respond to the corresponding event.

```javascript
$(document).bind('proceed.dirtyforms', function() { 
    // ...stuff to do before proceeding to the link/button that was clicked... 
});
```

| Name  | Parameters |  Description  |  
|---|---|---|
| **stay.dirtyforms**  | event  | Raised when the `choice.commit()` method is called with `choice.proceed` set to `false` before running any stay actions. In other words, called immediately when the user makes a stay choice.  |
| **afterstay.dirtyforms**  | event  | Raised when the `choice.commit()` method is called with `choice.proceed` set to `false` after running any stay actions.  |
| **proceed.dirtyforms**  | event, refireEvent  | Raised when the `choice.commit()` method is called with `choice.proceed` set to `true` before running any proceed actions. In other words, called immediately when the user makes a proceed choice. Passes the event that will be re-fired as the second parameter. Useful if you need to do things like save data back to fields which is normally part of event propagation - ala TinyMCE.  |
| **defer.dirtyforms**  | event  | Raised prior to showing the dialog to the user (whether a custom dialog, or the browser's dialog). Useful for accessing elements on the page prior to showing the dialog. |
| **beforeunload.dirtyforms**  | event | Non-cancelable event, raised prior leaving the page which may happen either as result of user selection if forms were dirty or due to a normal page exit of no changes were made.  |
| **bind.dirtyforms**  | event  | Raised before event binding (the first time that `.dirtyForms()` is called), allowing customization of event handlers. Useful to interoperate with IFrames. See [Customizing Event Handlers](#customizing-event-handlers) for details.  |


## Selectors

| Name  | Description  |  
|---|---|
| **:dirty**  | Selects all non-ignored elements with the dirty class attached. For example, `form:dirty` will select all non-ignored forms that are currently dirty. |
| **:dirtylistening**  | Selects all elements that has the listening class attached. This will be all forms that are currently listening for changes (provided all of them had the class added by calling `.dirtyForms()`).  |
| **:dirtyignored**  | Selects all elements that are currently ignored by Dirty Forms through the `ignoreSelector`, a helper's `ignoreSelector` or an element or a descendant of an element that has the `$.DirtyForms.ignoreClass` applied. Useful for checking whether an element is ignored (`$('.my-element').is(':dirtyignored')`).   |


## Helpers

Dirty Forms was created because the similar plugins that existed were not flexible enough. To provide more flexibility a basic helper framework has been added. With this system you can add in new helper objects which will provide additional ability to check for whether a form is dirty or not.

This is useful for custom widgets or when you're using 3rd party frameworks such as with TinyMCE or CKEditor.

#### Available Helpers

- [Always Dirty](https://github.com/NightOwl888/jquery.dirtyforms.helpers.alwaysdirty.dist#readme)
- [CKEditor](https://github.com/NightOwl888/jquery.dirtyforms.helpers.ckeditor.dist#readme)
- [TinyMCE](https://github.com/NightOwl888/jquery.dirtyforms.helpers.tinymce.dist#readme)

#### Custom Helpers

Helpers can be created by implementing and then pushing the helper to the `$.DirtyForms.helpers` array.

```javascript
$.DirtyForms.helpers.push(myHelper);
```

##### Members

#### `isDirty( $node, index )` (Optional)

Should return the dirty status of the helper. You can use jQuery to select all of the helpers within the node and test their dirty status.

```javascript
isDirty: function ($node) {
	var isDirty = false;
	
	// Search for all tinymce elements (either the current node or any nested elements).
	$node.filter(':tinymce').add($node.find(':tinymce')).each(function () {

		if ($(this).tinymce().isDirty()) {
			isDirty = true;

			// Return false to exit out of the each function
			return false;
		}
		
	});
	
	return isDirty;
}
```

##### `$node`

A jQuery object representing one of the elements of the `.dirtyForms('isDirty')` method selector.

##### `index`

The index number (integer) of the current `$node` within the `.dirtyForms('isDirty')` method selector.



#### `setClean( $node, index, excludeIgnored )` (Optional)

Should reset the dirty status of the helper so `isDirty(form)` will return `false` the next time it is called.

```javascript
setClean: function ($node) {

	// Search for all tinymce elements (either the current node or any nested elements).
	$node.filter(':tinymce').add($node.find(':tinymce')).each(function () {
		if ($(this).tinymce().isDirty()) {
			//Force not dirty state
			$(this).tinymce().isNotDirty = 1; 
		}
	});

}
```

##### `$node`

A jQuery object representing one of the elements of the `.dirtyForms('isDirty')` method selector.

##### `index`

The index number (integer) of the current `$node` within the `.dirtyForms('isDirty')` method selector.

##### `excludeIgnored`

A boolean value indicating whether to include or exclude ignored elements. Note that you can test whether it is ignored using the `:dirtyignored` selector.


#### `rescan( $node, index, excludeIgnored )` (Optional)

If the helper requires extra logic in order to track the original state, this method can be used to track the values of any elements that were dynamically added since the last scan or rescan.

##### `$node`

A jQuery object representing one of the elements of the `.dirtyForms('isDirty')` method selector.

##### `index`

The index number (integer) of the current `$node` within the `.dirtyForms('isDirty')` method selector.

##### `excludeIgnored`

A boolean value indicating whether to include or exclude ignored elements. Note that you can test whether it is ignored using the `:dirtyignored` selector.


#### `ignoreSelector` (Optional Property)

A jQuery selector of any anchor, input, select, or textarea elements to exclude from interacting with Dirty Forms. This works similarly to putting the `ignoreClass` on a specific element, but can be included with a specific helper.

```javascript
ignoreSelector: '.mceEditor a,.mceMenu a'
```

### Helper Example

To respect the way jQuery selectors work, all children of the form as well as the form itself should have your custom `isDirty()` and `setClean()` logic applied.


```javascript
// Example helper, the form is always considered dirty
(function($){

	// Create a new object, with an isDirty method
	var alwaysDirty = {
		// Ignored elements will not activate the dialog
		ignoreSelector : '.editor a, a.toolbar',
		isDirty : function($node){
			// Perform dirty check on a given node (usually a form element)
			return true;
		},
		setClean : function($node){
			// Perform logic to reset the node so the isDirty function will return true
			// the next time it is called for this node.

		}
		// To ensure full support with jQuery selectors,
		// make sure to run the action on all descendent
		// children of the node parameter. This is
		// accomplished easily by using the .find() jQuery
		// method.
		//
		// $node.find('.mySelector').each(function(){
		//     Run desired action against the child
		//     node here
		//     doSomething(this);
		// });
		// Run desired action against $(node) to handle the case
		// of a selector for a specific DOM element
		// if ($node.hasClass('.mySelector')) { doSomething(node); }

	}
	// Push the new object onto the helpers array
	$.DirtyForms.helpers.push(alwaysDirty);

})(jQuery);
```

See the [TinyMCE Helper Source Code](https://github.com/snikch/jquery.dirtyforms/blob/master/jquery.dirtyforms/helpers/tinymce.js) for another complete example.



## Dialogs

The default browser dialog can be overridden by setting a new dialog object or integrating one of the pre-built dialog modules. 

> NOTE: This works when the user attempts to leave the page by clicking hyperlinks within the page only. If the user interacts with the browser directly, the browser's dialog will be called instead since browsers don't provide a way to override this behavior.


#### Available Dialog Modules

- [BlockUI](https://github.com/NightOwl888/jquery.dirtyforms.dialogs.blockui.dist#readme)
- [Bootstrap Modal](https://github.com/NightOwl888/jquery.dirtyforms.dialogs.bootstrap.dist#readme)
- [Facebox](https://github.com/NightOwl888/jquery.dirtyforms.dialogs.facebox.dist#readme)
- [jQuery UI](https://github.com/NightOwl888/jquery.dirtyforms.dialogs.jquery-ui.dist#readme)
- [PNotify](https://github.com/NightOwl888/jquery.dirtyforms.dialogs.pnotify.dist#readme)

#### Custom Dialog Integration

You can create your own dialog integration by implementing the following members.

#### `open( choice, message, ignoreClass )` (Required)

Opens the dialog.

##### `choice`

An object that can be used to interact with Dirty Forms. It contains the following members.

| Name  | Type  | Default  | Description  |  
|---|---|---|---|
| **staySelector**  | string  | `''`  | A jQuery selector. The matching elements will have their click event bound to the stay choice (when the user decides to stay on the current page).   |   
| **proceedSelector**  | string  | `''`  | A jQuery selector. The matching elements will have their click event bound to the proceed choice (when the user decides to leave the current page). Generally, this should be a single element on the dialog to prevent the user from losing their form edits too easily.  |  
| **bindEscKey**  | bool  | `true`  | If `true`, the keydown event will be bound and if the escape key is pressed when the dialog is open, it will trigger the stay choice.  |  
| **bindEnterKey**  | bool  | `false` | If `true`, the keydown event will be bound and if the enter key is pressed when the dialog is open, it will trigger the stay choice.  |  
| **proceed**  | bool  | `false` | A flag that when set `false` will trigger a stay choice when the `commit()` method is called and will trigger a proceed choice when set `true` and the `commit()` method is called. |  
| **commit(event)**  | function  | N/A | An event handler that commits the choice that is stored in the `proceed` property. |  

##### `message`

The main message to show in the body of the dialog.

##### `ignoreClass`

A handy reference to the `$.DirtyForms.ignoreClass` that can be used to make Dirty Forms ignore elements (such as anchors) of the dialog.


#### `close( proceeding, unstashing )` (Optional)

Closes the dialog. This method is called after the choice is committed. 

##### `proceeding`

`true` if this is the proceed choice, `false` if this is the stay choice.

##### `unstashing`

`true` if the `unstash()` method will be called after this method. This can help to prevent issues from dialogs that respond to their corresponding close command too late and it closes the stash dialog instead of the Dirty Forms confirmation dialog.



#### `stash()` (Optional)

Stash returns the current contents of a dialog to be unstashed after a dialog choice of stay. All JavaScript datatypes are supported, including object and jQuery objects, and will be passed back as the `stash` parameter of the `unstash()` method. Use to store the current dialog content (from the application), when it's about to be replaced with the Dirty Forms confirmation dialog. This function can be omitted or return `false` if you don't wish to stash anything.

> See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `unstash( stash, event )` (Optional)

Unstash handles restoring the content of the dialog. You can omit this method (or return `false`) if you don't need to use stashing.

##### `stash`

The value that was returned from the `stash()` method (unless it was `false`, then `unstash()` won't be called).

##### `event`

The event that triggered the unstash (typically a button or anchor click).

> See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `stashSelector` (Optional Property)

A jQuery selector used to select the element whose child form will be cloned and put into the stash. This should be a class or id of a modal dialog with a form in it, not the dialog that Dirty Forms will show its confirmation message in. The purpose of stashing the form separately is to re-attach it to the DOM and refire events on if the user decides to proceed. This property can be omitted if you are not using stashing, but is required if you are using stashing.

> See the [Modal Dialog Stashing](#modal-dialog-stashing) section for more information.


#### `title` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the text of the dialog title.

If contributing a new dialog module, please include this property and set the default value to `Are you sure you want to do that?`.


#### `proceedButtonText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the text of the proceed button.

If contributing a new dialog module, please include this property and set the default value to `Leave This Page`.


#### `stayButtonText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the text of the stay button.

If contributing a new dialog module, please include this property and set the default value to `Stay Here`.


#### `preMessageText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to prepend text or HTML to the dialog message.

If contributing a new dialog module, consider adding this property if suitable for the dialog framework.


#### `postMessageText` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to append text or HTML to the dialog message.

If contributing a new dialog module, consider adding this property if suitable for the dialog framework.


#### `width` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the width of the dialog (if the dialog framework supports setting the width through JavaScript).

If contributing a new dialog module, consider adding this property if suitable for the dialog framework.


#### `class` (Optional Property)

Although this property is not used by Dirty Forms, you can define it to make it possible for the end user of the dialog module to set the class of the outermost element of the dialog. This can make it easy for the end user to style the dialog with CSS. Omit this setting if the dialog framework is using themes, since it typically doesn't make sense to override styles of an existing theme.

If contributing a new dialog module, consider adding this property if suitable for the dialog framework.


### Dialog Examples

#### BlockUI Dialog Example

Here is an example dialog setup using the [BlockUI jQuery plugin](http://malsup.com/jquery/block/).

```javascript
$(function() {

	$('form').dirtyForms({
		dialog: {
			open: function (choice, message) {
				$.blockUI({
					message: '<span class="dirty-dialog">' +
							'<h3>Are you sure you want to do that?</h3>' +
							'<p>' + message + '</p>' +
							'<span>' +
								'<button type="button" class="dirty-proceed">Leave This Page</button> ' +
								'<button type="button" class="dirty-stay">Stay Here</button>' +
							'</span>' +
						'</span>',
					css: {
						width: '400px',
						padding: '10px',
						cursor: 'auto'
					},
					overlayCSS: {
						cursor: 'auto'
					}
				});

				// Bind Events

				// By default, BlockUI binds the Enter key to the first button, 
				// which would be the proceed button in our case. So, we need
				// to take control and bind it to the stay action instead to 
				// prevent it from being a dangerous key.
				choice.bindEnterKey = true;

				// Bind both buttons to the appropriate actions.
				// Also bind the overlay so if the user clicks outside the dialog, 
				// it closes and stays on the page (optional).
				choice.staySelector = '.dirty-dialog .dirty-stay,.blockOverlay';
				choice.proceedSelector = '.dirty-dialog .dirty-proceed';
			},
			close: function () {
				$.unblockUI();
			}
		}
	});
	
});
```

> Note that you can also specify the dialog using the syntax `$.DirtyForms.dialog = { /* the dialog members */ };`. This way they can be packaged as separate reusable modules.

#### jQuery UI Dialog Example

Here is a more advanced example using [jQuery UI Dialog](https://jqueryui.com/dialog/). The jQuery UI [`close` event](http://api.jqueryui.com/dialog/#event-close) is used along with a combination of the `choice.proceed` property and `choice.commit()` method to ensure every time the dialog is closed a choice is made. In addition, we are setting the dialog on the public `$.DirtyForms.dialog` property, making this into a separate dialog module that will automatically override the default browser dialog without specifying the dialog when calling `.dirtyForms()`.

```javascript
$(function() {

	// jQuery UI requires that the HTML be in the DOM
	// already before it is called. So we add it during
	// page load.
    $('body').append('<div id="dirty-dialog" style="display:none;" />');

	$.DirtyForms.dialog = {
		// Custom properties to allow overriding later using 
		// the syntax $.DirtyForms.dialog.title = 'custom title';
		
        title: 'Are you sure you want to do that?',
        proceedButtonText: 'Leave This Page',
        stayButtonText: 'Stay Here',
        preMessageText: '<span class="ui-icon ui-icon-alert" style="float:left; margin:2px 7px 25px 0;"></span>',
        postMessageText: '',
        width: 430,
		
        // Dirty Forms Methods
        open: function (choice, message) {
            $('#dirty-dialog').dialog({
                open: function () {
                    // Set the focus on close button. This takes care of the 
					// default action by the Enter key, ensuring a stay choice
					// is made by default.
                    $(this).parents('.ui-dialog')
						   .find('.ui-dialog-buttonpane button:eq(1)')
						   .focus();
                },
				
				// Whenever the dialog closes, we commit the choice
                close: choice.commit,
                title: this.title,
                width: this.width,
                modal: true,
                buttons: [
                    {
                        text: this.proceedButtonText,
                        click: function () {
							// Indicate the choice is the proceed action
                            choice.proceed = true;
                            $(this).dialog('close');
                        }
                    },
                    {
                        text: this.stayButtonText,
                        click: function () {
							// We don't need to take any action here because
							// this will fire the close event handler and
							// commit the choice (stay) for us automatically.
                            $(this).dialog('close');
                        }
                    }
                ]
            });
			
			// Inject the content of the dialog using jQuery .html() method.
            $('#dirty-dialog').html(this.preMessageText + message + this.postMessageText);
        },
        close: function () {
			// This is called by Dirty Forms when the 
			// Escape key is pressed, so we will close
			// the dialog manually. This overrides the default
			// Escape key behavior of jQuery UI, which would
			// ordinarily not fire the close: event handler 
			// declared above.
            $('#dirty-dialog').dialog('close');
        }
	};
	
});
```

### Modal Dialog Stashing

Dialog stashing is meant for the following scenario.

1. The dialog framework doesn't allow overlaying a modal dialog on top of another modal dialog.
2. A form is hosted inside a modal dialog.
3. The modal dialog with the form has an anchor tag that navigates off of the page.

You don't need to use stashing if any of the above items are false.

If you have a form and link which is in a modal dialog (a modal dialog created by some other part of your application) then when the Dirty Forms modal fires, the original modal is removed. So the stash saves the content from the original modal dialog while Dirty Forms shows its modal dialog, and then re-shows the original modal dialog with the edits if the user chooses to stay on the page.

> **TIP:** If you stash a jQuery object, it will contain the state of the DOM including edits to fields.

#### Dialog Stashing Example

Here is an example of dialog stashing using Facebox.

```javascript
$(function() {

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
        title: 'Are you sure you want to do that?',
        proceedButtonClass: 'button medium red',
        proceedButtonText: 'Leave This Page',
        stayButtonClass: 'button medium',
        stayButtonText: 'Stay Here',

        // Typical Dirty Forms Properties and Methods

        
        open: function (choice, message, ignoreClass) {
		
            var content =
                '<h1>' + this.title + '</h1>' +
                '<p>' + message + '</p>' +
                '<p>' +
                    '<a href="#" class="dirty-proceed ' + ignoreClass + ' ' + this.proceedButtonClass + '">' + this.proceedButtonText + '</a>' +
                    '<a href="#" class="dirty-stay ' + ignoreClass + ' ' + this.stayButtonClass + '">' + this.stayButtonText + '</a>' +
                '</p>';
            $.facebox(content);

            // Bind Events
            choice.bindEnterKey = true;
            choice.staySelector = '#facebox .dirty-stay, #facebox .close, #facebox_overlay';
            choice.proceedSelector = '#facebox .dirty-proceed';
        },
		
		// Dialog Stashing Support
		
        close: function (proceeding, unstashing) {
			// Due to a bug in Facebox that causes it to
			// close the stashed dialog when it reappears, 
			// we skip the call to 'close.facebox' when
			// the next method call will be unstash().
            if (!unstashing) {
                $(document).trigger('close.facebox');
            }
        },
		
		// Selector for stashing the content of another dialog.
		// This should be the dialog that contains the form you want
		// to stash, not the Dirty Forms confirmation dialog.
        stashSelector: '#facebox .content',
		
		// Save the dialog content to the stash.
        stash: function () {
            var fb = $('#facebox');

			// Before returning the object that will be stashed, 
			// we check to see if there is any HTML and
			// whether the dialog is visible. We just get the
			// elements we need to save and then do a deep clone,
			// which will save the user's edits.
            return ($.trim(fb.html()) === '' || fb.css('display') != 'block') ?
               false :
               $('#facebox .content').children().clone(true);
        },
		
		// On the return trip (after the user takes the 
		// stay choice in the confirmation dialog), 
		// the jQuery object representing 
		// $('#facebox .content').children() is returned, so 
		// we just need to add it back to the dialog again.
		// This process may vary depending on the dialog framework.
        unstash: function (stash, ev) {
            $.facebox(stash);
        }
	};
	
});
```

## Event Handler Customization

If you need Dirty Forms to work with either parent or child IFrames, you can attach custom events and override the default event handling code. This is useful if you want to monitor events of an IFrame or change the target frame that is redirected instead of using the default behavior.

You just need to hook the `bind.dirtyforms` event prior to the first call to `.dirtyForms()`. An `events` object is passed as the second parameter and it contains the following methods.

### Event Object Methods

#### `bind( window, document, data )`

Binds all of the events for Dirty Forms.

##### `window`

The DOM window to use to bind the events to. The default uses the DOM window object from the Dirty Forms context.

##### `document`

The DOM document to use to bind the events to. The default uses the DOM document object from the Dirty Forms context.

##### `data`

The event data to be passed along to each of the event handlers. The default is an empty object (`{}`);


#### `bindForm( $form, data )`

Binds the events to a form and sets the listening class so the :dirtylistening selector will include it.

##### `$form`

A jQuery object containing a form or multiple forms to bind. This method is called once for each form specified in the selector used when calling `.dirtyForms()`.

##### `data`

The event data to be passed along to each of the event handlers. The default is an empty object (`{}`);


#### `onFocus( event )`

The event handler for the `focus` and `keydown` events of each field that matches the `fieldSelector`.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onFieldChange( event )`

The event handler for the `change`, `input`, `propertychange`, and `keydown` events of each field that matches the `fieldSelector`.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onReset( event )`

The event handler for the `reset` event of each form.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onAnchorClick( event )`

The event handler for the `click` event of each anchor that has a valid `href` and is not `target="_blank"`.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onSubmit( event )`

The event handler for the `submit` event of each form.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onBeforeUnload( event )`

The event handler for the `beforeunload` event of the `window` object.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onRefireClick( event )`

Called after the user decides to proceed after the dialog is shown (not including the browser dialog).

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `onRefireAnchorClick( event )`

Called by `onRefireClick()` after attempting to execute the event. If the execution didn't cause the page to redirect or reload, we end up here and the assumption is that the user clicked an anchor.

##### `event`

A jQuery event object containing context from the element that caused the event.


#### `clearUnload()`

Detaches the `beforeunload` event from the `window` object. This is done when making a proceed choice from the dialog.


### Example Usage

> IMPORTANT: The handler for `bind.dirtyforms` must be declared before `.dirtyForms()` is called.

```javascript
$(function() {

	// Add functionality to an event handler
	$(document).bind('bind.dirtyforms', function (ev, events) {
		var showAlert = function(when) {
			alert('hello world ' + when);
		};

		var originalBind = events.bind;

		events.bind = function (ev) {
			showAlert('before');
			originalBind(ev);
			showAlert('after');
		};
	});


	// Bind additional events to existing handlers
	$(document).bind('bind.dirtyforms', function (ev, events) {
		var originalBind = events.bind;

		events.bind = function (window, document, data) {
			originalBind(window, document, data);
			$('button.mybutton').bind('click', events.onAnchorClick);
		};
	});


	// Pass data between handlers via events
	$(document).bind('bind.dirtyforms', function (ev, events) {
		var originalOnAnchorClick = events.onAnchorClick;
		var originalOnRefireAnchorClick = events.onRefireAnchorClick;

		events.onAnchorClick = function (ev) {
			ev.data.hello = 'Hello there!';
			originalOnAnchorClick(ev);
		};
		events.onRefireAnchorClick = function (ev) {
			// Shows "Hello there!"
			alert(ev.data.hello);
			originalOnRefireAnchorClick(ev);
		};
	});


	// Watch the top (parent) document for clicks when hosted within an IFrame
	$(document).bind('bind.dirtyforms', function (ev, events) {
		events.bind(window.top, window.top.document);
	});


	// Watch the top document for clicks when hosted within an IFrame and
	// change the target window depending on whether the user clicked an anchor 
	// on the top page. If the anchor within an IFrame is non-local, redirect
	// the top browser window instead of within the IFrame.
	$(document).bind('bind.dirtyforms', function (ev, events) {
		events.bind(window.top, window.top.document, { isTopDocument: true });

		events.onRefireAnchorClick = function (ev) {
			var $a = $(ev.target).closest('[href]'),
				href = $a.attr('href'),
				isLocal = $a[0].host === window.location.host;

			if (ev.data.isTopDocument || !isLocal) {
				// For IFrame and non-local, redirect top document
				$.DirtyForms.dirtylog('Sending top location to ' + href);
				window.top.location.href = href;
			} else {
				$.DirtyForms.dirtylog('Sending location to ' + href);
				window.location.href = href;
			}
		};
	});


	// Advanced usage - watch the top document, keep track of its dirty
	// state, and block the exit of changes to the top document using a helper.
	$(document).bind('bind.dirtyforms', function (ev, events) {
		events.bind(window.top, window.top.document, { isTopDocument: true });

		// Locate all of the forms in the top document and bind them 
		// to listen for events that change the dirty status.
		var $forms = $(window.top.document).find('form');
		events.bindForm($forms, {});

		events.onRefireAnchorClick = function (ev) {
			var $a = $(ev.target).closest('[href]'),
				href = $a.attr('href'),
				isLocal = $a[0].host === window.location.host;

			if (ev.data.isTopDocument || !isLocal) {
				// For IFrame and non-local, redirect top document
				$.DirtyForms.dirtylog('Sending top location to ' + href);
				window.top.location.href = href;
			} else {
				$.DirtyForms.dirtylog('Sending location to ' + href);
				window.location.href = href;
			}
		};
	});

	// Continued: A helper to report the dirty status from the top document, 
	// and to allow setClean and rescan methods to affect the top document. 
	// We pass in true to the excludeHelpers parameter so we don't get 
	// a recursive loop.
	var topDocumentHelper = {
		isNotTopDocument: window.top !== window.self,
		isDirty: function ($node, index) {
			// Prevent from calling when the window is not in
			// an IFrame and there is no need to execute for every node.
			if (this.isNotTopDocument && index === 0) {
				return $(window.top.document).dirtyForms('isDirty', true);
			}
			return false;
		},
		setClean: function ($node, index, excludeIgnored) {
			if (this.isNotTopDocument && index === 0) {
				$(window.top.document).dirtyForms('setClean', excludeIgnored, true);
			}
		},
		rescan: function ($node, index, excludeIgnored) {
			if (this.isNotTopDocument && index === 0) {
				$(window.top.document).dirtyForms('rescan', excludeIgnored, true);
			}
		}
	};
	$.DirtyForms.helpers.push(topDocumentHelper);

});
```