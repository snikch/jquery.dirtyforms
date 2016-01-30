[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.dialogs.bootstrap

This is a dialog module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This module causes Dirty Forms to use Bootstrap Modal as its dialog when the user attempts to leave the page by clicking a hyperlink (but not when interacting with the navigation buttons of the browser).

> Only 1 dialog module can be used by Dirty Forms at a time. The default behavior without this package is to use the browser's built in dialog that is fired by the `beforeunload` event.

## Prerequisites

Prerequesites must be included in this order:

- [jQuery](http://jquery.com) (>= 1.9.1)
- [bootstrap](http://getbootstrap.com/) (>= 3.0.0) - both the CSS and JS
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms) (>= 1.0.0)

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The Bootstrap Modal dialog module is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.bootstrap.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, bootstrap, jquery.dirtyforms, and jquery.dirtyforms.dialogs.bootstrap in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,bootstrap@3.0.0,jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.dialogs.bootstrap.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the Bootstrap Modal dialog module to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.bootstrap.dist/master/jquery.dirtyforms.dialogs.bootstrap.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.bootstrap.dist/master/jquery.dirtyforms.dialogs.bootstrap.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.dialogs.bootstrap.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The Bootstrap Modal dialog module is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the dialog module, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.dialogs.bootstrap.svg)](http://www.npmjs.org/package/jquery.dirtyforms.dialogs.bootstrap)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.dialogs.bootstrap.svg)](http://bower.io/search/?q=jquery.dirtyforms.dialogs.bootstrap)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.dialogs.bootstrap.svg)](https://www.nuget.org/packages/jquery.dirtyforms.dialogs.bootstrap/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.dialogs.bootstrap.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.dialogs.bootstrap/)
```
// NPM
$ npm install jquery.dirtyforms.dialogs.bootstrap

// Bower
$ bower install jquery.dirtyforms.dialogs.bootstrap

// NuGet
PM> Install-Package jquery.dirtyforms.dialogs.bootstrap
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.bootstrap.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.dialogs.bootstrap.min.js.map
```

## Usage

This dialog module is automatic. Simply include the reference to the dialog module after the [prerequisites](#prerequisites) and use Dirty Forms [as per the documentation](https://github.com/snikch/jquery.dirtyforms#usage) and Bootstrap Modal [as per the documentation](http://getbootstrap.com/javascript/#modals). However, it is also possible to [customize the HTML](#customization).

```HTML
// CSS
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/3.0.0/css/bootstrap.min.css" />

// JavaScript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/bootstrap/3.0.0/js/bootstrap.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.bootstrap.min.js" type="text/javascript"></script>
```

> If not using a CDN, you need to apply the dependencies in the same order as in the example above.



## Options

The following options are available to set via **$.DirtyForms.dialog.OPTIONNAME = OPTIONVALUE** or get via **OPTIONVALUE = $.DirtyForms.dialog.OPTIONNAME**

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	<tr>
		<th align="left">title</th>
		<td>string</td>
		<td>'<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Are you sure you want to do that?'</td>
		<td>Sets the title of the dialog. Supports HTML.</td>
	</tr>
	<tr>
		<th align="left">proceedButtonClass</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-proceed'</td>
		<td>Sets the CSS class of the continue button of the dialog (an HTML button tag element). The element with this class will automatically have the proceedButtonText inserted into it and a click event handler bound to it before showing the dialog.</td>
	</tr>
	<tr>
		<th align="left">proceedButtonText</th>
		<td>string</td>
		<td nowrap="nowrap">'Leave This Page'</td>
		<td>Sets the text of the continue button of the dialog.</td>
	</tr>
	<tr>
		<th align="left">stayButtonClass</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-stay'</td>
		<td>Sets the CSS class of the cancel button of the dialog (an HTML button tag element). The element with this class will automatically have the stayButtonText inserted into it before showing the dialog.</td>
	</tr>
	<tr>
		<th align="left">stayButtonText</th>
		<td>string</td>
		<td nowrap="nowrap">'Stay Here'</td>
		<td>Sets the text of the cancel button of the dialog.</td>
	</tr>
	<tr>
		<th align="left">dialogID</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-dialog'</td>
		<td>Sets the ID of the outermost element of the dialog. If there is an element with this ID on the page, it will be used for the dialog. If not, a default dialog will be automatically generated.</td>
	</tr>
	<tr>
		<th align="left">titleID</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-title'</td>
		<td>Sets the ID of the element that represents the dialog title. The element with this ID will automatically have the title text inserted into it before showing the dialog.</td>
	</tr>
	<tr>
		<th align="left">messageClass</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-message'</td>
		<td>Sets the CSS class of the element that represents the message body. The element with this class will automatically have the message inserted into it before showing the dialog.</td>
	</tr>
	<tr>
		<th align="left">preMessageText</th>
		<td>string</td>
		<td nowrap="nowrap">''</td>
		<td>Sets the text that precedes the message text. May contain HTML.</td>
	</tr>
	<tr>
		<th align="left">postMessageText</th>
		<td>string</td>
		<td nowrap="nowrap">''</td>
		<td>Sets the text that follows the message text. May contain HTML.</td>
	</tr>
	<tr>
		<th align="left">replaceText</th>
		<td>boolean</td>
		<td nowrap="nowrap">true</td>
		<td>Set to false to prevent the title, message, continue button text, and cancel button text in the dialog from being overwritten by the configured values. This is useful if you want to configure your dialog text entirely in the HTML of the page.</td>
	</tr>
</table>

> Setting the width of the bootstrap modal requires custom CSS to ensure it will work with different viewport sizes. See [this page](http://coolestguidesontheplanet.com/bootstrap/modal.php) for examples.


## Customization

Because Bootstrap requires ultimate control over the HTML in order to function, it is possible to provide your own HTML either directly into the page or via JavaScript. Simply add it to the page and ensure that the following match what is specified in the options.

1. dialogID (required)
2. titleID (optional)
3. messageClass (optional)
3. proceedButtonClass (required)
4. stayButtonClass (optional)


### Example

```javascript

$('<div id="custom-dialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="custom-title">' +
	'<div class="modal-dialog" role="document">' +
		'<div class="modal-content panel-danger">' +
			'<div class="modal-header panel-heading">' +
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close">' + 
					'<span aria-hidden="true">&times;</span>' + 
				'</button>' +
				'<h3 class="modal-title" id="custom-title"></h3>' +      
			'</div>' +
			'<div class="modal-body panel-body custom-message"></div>' +
			'<div class="modal-body panel-body">This is some custom text to include in the dialog.</div>' +
			'<div class="modal-footer panel-footer">' +
				'<button type="button" class="custom-proceed btn btn-primary" data-dismiss="modal"></button>' +
				'<button type="button" class="custom-stay btn btn-default" data-dismiss="modal"></button>' +
			'</div>' +
		'</div>' +
	'</div>' +
'</div>').appendTo('body');


$('form').dirtyForms({
	// Message will be shown both in the Bootstrap Modal dialog 
	// and in most browsers when attempting to navigate away 
	// using browser actions.
	message: 'This is a custom message',
	dialog: {
		title: 'This is a custom title',
		dialogID: 'custom-dialog', 
		titleID: 'custom-title', 
		messageClass: 'custom-message', 
		proceedButtonClass: 'custom-proceed', 
		stayButtonClass: 'custom-stay' 
	}
});

// If .dirtyForms() has already been called, you can override
// the values after the fact like this.
$.DirtyForms.dialog.title = 'This is an alternative custom title';

```


## Support

For help or to report a bug please [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) at the [Dirty Forms development site](https://github.com/snikch/jquery.dirtyforms/).