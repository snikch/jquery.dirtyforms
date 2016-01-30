[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.dialogs.pnotify

This is a dialog module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This module causes Dirty Forms to use PNotify as its dialog when the user attempts to leave the page by clicking a hyperlink (but not when interacting with the navigation buttons of the browser).

> Only 1 dialog module can be used by Dirty Forms at a time. The default behavior without this package is to use the browser's built in dialog that is fired by the `beforeunload` event.

## Prerequisites

Prerequesites must be included in this order:

- CSS theme from [BootStrap 3](http://getbootstrap.com/), [jQuery UI](http://jqueryui.com/themeroller/), or [Font Awesome](http://fontawesome.io/)
- [jQuery](http://jquery.com) (>= 1.6.0)
- [PNotify](http://sciactive.com/pnotify/) (>= 1.3) - both the CSS and JS
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms) (>= 1.0.0)

**NOTE:** In PNotify 3.x, you must include the Confirm module and the History module JavaScript files after the main PNotify file.

> If you are using a [Package Manager](#package-managers), the JavaScript dependencies will be installed automatically, but you will need to manually get a CSS theme if you are not already using one. Also, depending on your environment you may still need to add references to the JavaScript manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The PNotify dialog module is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.pnotify.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, PNotify, jquery.dirtyforms, and jquery.dirtyforms.dialogs.pnotify in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,pnotify@3.0.0(pnotify.js+pnotify.confirm.js+pnotify.history.js),jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.dialogs.pnotify.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the PNotify dialog module to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.pnotify.dist/master/jquery.dirtyforms.dialogs.pnotify.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.pnotify.dist/master/jquery.dirtyforms.dialogs.pnotify.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.dialogs.pnotify.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The PNotify dialog module is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the dialog module, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.dialogs.pnotify.svg)](http://www.npmjs.org/package/jquery.dirtyforms.dialogs.pnotify)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.dialogs.pnotify.svg)](http://bower.io/search/?q=jquery.dirtyforms.dialogs.pnotify)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.dialogs.pnotify.svg)](https://www.nuget.org/packages/jquery.dirtyforms.dialogs.pnotify/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.dialogs.pnotify.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.dialogs.pnotify/)

```
// NPM
$ npm install jquery.dirtyforms.dialogs.pnotify

// Bower
$ bower install jquery.dirtyforms.dialogs.pnotify

// NuGet
PM> Install-Package jquery.dirtyforms.dialogs.pnotify
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.pnotify.min.js.map"></script>
```

#### Package Managers

Bower and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.dialogs.pnotify.min.js.map
```

## Usage

This dialog module is automatic. Simply include the reference to the dialog module after the [prerequisites](#prerequisites) and use Dirty Forms [as per the documentation](https://github.com/snikch/jquery.dirtyforms#usage) and PNotify [as per the documentation](http://sciactive.com/pnotify/).

```HTML
// Theme (use one of: BootStrap 3, jQuery UI, or Font Awesome)

// BootStrap 3
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/3.3.5/css/bootstrap.min.css" />

// jQuery UI (many other themes available at [jsDelivr](https://github.com/jsdelivr/jsdelivr/tree/master/files/jquery.ui/1.11.3/themes))
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.ui/1.11.3/jquery-ui.min.css" />

// Font Awesome
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/fontawesome/4.3.0/css/font-awesome.min.css" />

// PNotify (required)
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/pnotify/3.0.0/pnotify.css" />

// JavaScript (required)
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/pnotify/3.0.0/pnotify.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/pnotify/3.0.0/pnotify.confirm.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/pnotify/3.0.0/pnotify.history.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.pnotify.min.js" type="text/javascript"></script>
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
		<td>'Are you sure you want to do that?'</td>
		<td>Sets the title of the dialog.</td>
	</tr>
	<tr>
		<th align="left">class</th>
		<td>string</td>
		<td nowrap="nowrap">'dirty-dialog'</td>
		<td>Sets the CSS class of the DIV element (SPAN if using PNotify 1.3) that contains all of the elements of the dialog.</td>
	</tr>
	<tr>
		<th align="left">proceedButtonText</th>
		<td>string</td>
		<td nowrap="nowrap">'Leave This Page'</td>
		<td>Sets the text of the continue button of the dialog.</td>
	</tr>
	<tr>
		<th align="left">stayButtonText</th>
		<td>string</td>
		<td nowrap="nowrap">'Stay Here'</td>
		<td>Sets the text of the cancel button of the dialog.</td>
	</tr>
	<tr>
		<th align="left">styling</th>
		<td>string</td>
		<td nowrap="nowrap">'bootstrap3'</td>
		<td>Sets the CSS theme you want to style PNotify. Available choices: 'bootstrap3', 'jqueryui', or 'fontawesome'. See the theme section of the <a href="http://sciactive.com/pnotify/">PNotify documentation</a> for details.</td>
	</tr>
	<tr>
		<th align="left">width</th>
		<td>string</td>
		<td nowrap="nowrap">'330'</td>
		<td>Sets the width of the dialog.</td>
	</tr>
</table>