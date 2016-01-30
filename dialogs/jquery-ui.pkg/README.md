[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.dialogs.jquery-ui

This is a dialog module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This module causes Dirty Forms to use jQuery UI as its dialog when the user attempts to leave the page by clicking a hyperlink (but not when interacting with the navigation buttons of the browser).

> Only 1 dialog module can be used by Dirty Forms at a time. The default behavior without this package is to use the browser's built in dialog that is fired by the `beforeunload` event.

## Prerequisites

Prerequesites must be included in this order:

- [jQuery](http://jquery.com) (>= 1.4.2)
- [jquery-ui](http://jqueryui.com/download/) (>= 1.8.14) - both the JS for the jQuery UI dialog (or a combined package) and CSS
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms) (>= 1.0.0)

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The jQuery UI dialog module is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.jquery-ui.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, jQuery UI, jquery.dirtyforms, and jquery.dirtyforms.dialogs.jquery-ui in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.ui@1.11.3,jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.dialogs.jquery-ui.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the jQuery UI dialog module to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.jquery-ui.dist/master/jquery.dirtyforms.dialogs.jquery-ui.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.jquery-ui.dist/master/jquery.dirtyforms.dialogs.jquery-ui.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.dialogs.jquery-ui.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The jQuery UI dialog module is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the dialog module, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.dialogs.jquery-ui.svg)](http://www.npmjs.org/package/jquery.dirtyforms.dialogs.jquery-ui)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.dialogs.jquery-ui.svg)](http://bower.io/search/?q=jquery.dirtyforms.dialogs.jquery-ui)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.dialogs.jquery-ui.svg)](https://www.nuget.org/packages/jquery.dirtyforms.dialogs.jquery-ui/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.dialogs.jquery-ui.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.dialogs.jquery-ui/)
```
// NPM
$ npm install jquery.dirtyforms.dialogs.jquery-ui

// Bower
$ bower install jquery.dirtyforms.dialogs.jquery-ui

// NuGet
PM> Install-Package jquery.dirtyforms.dialogs.jquery-ui
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.jquery-ui.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.dialogs.jquery-ui.min.js.map
```

## Usage

This dialog module is automatic. Simply include the reference to the dialog module after the [prerequisites](#prerequisites) and use Dirty Forms [as per the documentation](https://github.com/snikch/jquery.dirtyforms#usage) and jQuery UI [as per the documentation](https://api.jqueryui.com/dialog/).

```HTML
// CSS
// jQuery UI (many other themes available at [jsDelivr](https://github.com/jsdelivr/jsdelivr/tree/master/files/jquery.ui/1.11.3/themes))
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.ui/1.11.3/jquery-ui.min.css" />

// JavaScript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.ui/1.11.3/jquery-ui.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.jquery-ui.min.js" type="text/javascript"></script>
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
		<th align="left">preMessageText</th>
		<td>string</td>
		<td>'<span class="ui-icon ui-icon-alert" style="float:left; margin:2px 7px 25px 0;"></span>'</td>
		<td>Sets the text that precedes the message text. May contain HTML.</td>
	</tr>
	<tr>
		<th align="left">postMessageText</th>
		<td>string</td>
		<td nowrap="nowrap">''</td>
		<td>Sets the text that follows the message text. May contain HTML.</td>
	</tr>
	<tr>
		<th align="left">width</th>
		<td>int</td>
		<td nowrap="nowrap">430</td>
		<td>The width of the dialog.</td>
	</tr>
</table>


## Support

For help or to report a bug please [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) at the [Dirty Forms development site](https://github.com/snikch/jquery.dirtyforms/).
