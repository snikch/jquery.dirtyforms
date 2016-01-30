[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.helpers.tinymce

This is a helper module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This helper causes Dirty Forms to read and/or update the dirty status from TinyMCE instances on the form. This will ensure that when a user edits a TinyMCE field, Dirty Forms will be notified of the event in order to mark the form dirty.

## Prerequisites

Prerequesites must be included in this order:

- [jQuery](http://jquery.com) (>= 1.4.2)
- tinymce
- jquery.tinymce
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms) (>= 1.0.0)

Both of the TinyMCE files are included in the [TinyMCE jQuery package](http://www.tinymce.com/download/download.php).

**Note:** There are [known compatibility issues](http://bugs.jquery.com/ticket/11527) between jQuery 1.7.2 and higher and TinyMCE versions lower than 3.5b3. These issues can cause the dialog proceed function to fail in dirtyForms.

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The TinyMCE helper is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.tinymce.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, TinyMCE, the jQuery TinyMCE plugin, jquery.dirtyforms, and jquery.dirtyforms.helpers.tinymce in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,tinymce(tinymce.min.js+jquery.tinymce.min.js),jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.helpers.tinymce.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the TinyMCE helper to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.helpers.tinymce.dist/master/jquery.dirtyforms.helpers.tinymce.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.helpers.tinymce.dist/master/jquery.dirtyforms.helpers.tinymce.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.helpers.tinymce.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The TinyMCE helper is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the helper, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.helpers.tinymce.svg)](http://www.npmjs.org/package/jquery.dirtyforms.helpers.tinymce)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.helpers.tinymce.svg)](http://bower.io/search/?q=jquery.dirtyforms.helpers.tinymce)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.helpers.tinymce.svg)](https://www.nuget.org/packages/jquery.dirtyforms.helpers.tinymce/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.helpers.tinymce.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.helpers.tinymce/)
```
// NPM
$ npm install jquery.dirtyforms.helpers.tinymce

// Bower
$ bower install jquery.dirtyforms.helpers.tinymce

// NuGet
PM> Install-Package jquery.dirtyforms.helpers.tinymce
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.tinymce.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.helpers.tinymce.min.js.map
```

## Usage

This helper is completely automatic - there are no properties or methods to interact with. Simply include the reference to the helper after the [prerequisites](#prerequisites) and use Dirty Forms [as per the documentation](https://github.com/snikch/jquery.dirtyforms#usage) and TinyMCE [as per the documentation](http://www.tinymce.com/wiki.php/Installation).

```HTML
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/tinymce/latest/tinymce.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/tinymce/latest/jquery.tinymce.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.tinymce.min.js" type="text/javascript"></script>
```

> If not using a CDN, you need to apply the dependencies in the same order as in the example above.


## Support

For help or to report a bug please [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) at the [Dirty Forms development site](https://github.com/snikch/jquery.dirtyforms/).
