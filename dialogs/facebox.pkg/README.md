[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.dialogs.facebox

This is a dialog module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This module causes Dirty Forms to use Facebox as its dialog when the user attempts to leave the page by clicking a hyperlink (but not when interacting with the navigation buttons of the browser).

> Only 1 dialog module can be used by Dirty Forms at a time. The default behavior without this package is to use the browser's built in dialog that is fired by the `beforeunload` event.

## Prerequisites

Prerequesites must be included in this order:

- [jQuery](http://jquery.com) (>= 1.4.2) - Stashing support for select elements requires jQuery >= 1.6
- [jquery.facebox](https://github.com/NightOwl888/facebox) (>= 1.4.1) - both the CSS and JS
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms) (>= 1.0.0)

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The Facebox dialog module is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.facebox.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, jquery.facebox, jquery.dirtyforms, and jquery.dirtyforms.dialogs.facebox in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.facebox,jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.dialogs.facebox.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the Facebox dialog module to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.facebox.dist/master/jquery.dirtyforms.dialogs.facebox.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.dialogs.facebox.dist/master/jquery.dirtyforms.dialogs.facebox.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.dialogs.facebox.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The Facebox dialog module is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the dialog module, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.dialogs.facebox.svg)](http://www.npmjs.org/package/jquery.dirtyforms.dialogs.facebox)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.dialogs.facebox.svg)](http://bower.io/search/?q=jquery.dirtyforms.dialogs.facebox)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.dialogs.facebox.svg)](https://www.nuget.org/packages/jquery.dirtyforms.dialogs.facebox/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.dialogs.facebox.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.dialogs.facebox/)
```
// NPM
$ npm install jquery.dirtyforms.dialogs.facebox

// Bower
$ bower install jquery.dirtyforms.dialogs.facebox

// NuGet
PM> Install-Package jquery.dirtyforms.dialogs.facebox
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.facebox.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.dialogs.facebox.min.js.map
```

## Usage

This dialog module is automatic. Simply include the reference to the dialog module after the [prerequisites](#prerequisites) and use Dirty Forms [as per the documentation](https://github.com/snikch/jquery.dirtyforms#usage) and Facebox [as per the documentation](http://github.com/NightOwl888/jquery.facebox).

```HTML
// CSS
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.facebox/latest/jquery.facebox.min.css" />

// JavaScript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.facebox/latest/jquery.facebox.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.dialogs.facebox.min.js" type="text/javascript"></script>
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
		<th align="left">proceedButtonClass</th>
		<td>string</td>
		<td nowrap="nowrap">''</td>
		<td>Sets the CSS class of the continue button of the dialog (an HTML anchor tag element).</td>
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
		<td nowrap="nowrap">''</td>
		<td>Sets the CSS class of the cancel button of the dialog (an HTML anchor tag element).</td>
	</tr>
	<tr>
		<th align="left">stayButtonText</th>
		<td>string</td>
		<td nowrap="nowrap">'Stay Here'</td>
		<td>Sets the text of the cancel button of the dialog.</td>
	</tr>
	<tr>
		<th align="left">stashSelector</th>
		<td>string</td>
		<td nowrap="nowrap">'#facebox .content'</td>
		<td>When using stashing, setting this selector chooses the element of the modal dialog containing your form that will be included in the stash and later restored during unstash (if the user clicks cancel).</td>
	</tr>
</table>

> For information about stashing, see the [Modal Dialog Stashing](https://github.com/snikch/jquery.dirtyforms#modal-dialog-stashing) section.


## Support

For help or to report a bug please [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) at the [Dirty Forms development site](https://github.com/snikch/jquery.dirtyforms/).
