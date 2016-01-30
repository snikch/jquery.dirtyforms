[![jquery-dirtyforms MyGet Build Status](https://www.myget.org/BuildSource/Badge/jquery-dirtyforms?identifier=193d9dab-a526-484e-8062-9a960322f246)](https://www.myget.org/)

![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# jquery.dirtyforms.helpers.alwaysdirty

This is a helper module for the [jQuery Dirty Forms](https://github.com/snikch/jquery.dirtyforms) project.

## Purpose

This helper causes Dirty Forms to always show a dirty status, effectively overriding the logic that causes the form 
to be dirty when one of the input or select HTML controls is updated. It was primarily written to demonstrate 
how to write a custom helper, but may also be helpful in real-world scenarios where you don't want the user to navigate 
from the page without their explicit consent.

## Prerequisites

Prerequesites must be included in this order:

- [jQuery](http://jquery.com) (>= 1.4.2)
- [jquery.dirtyforms](https://github.com/snikch/jquery.dirtyforms)

> If you are using a [Package Manager](#package-managers), these dependencies will be installed automatically, but depending on your environment you may still need to add references to them manually.

## Download & Installation
There are several different ways to get the code. Some examples below:

#### CDN
The Always Dirty helper is available over jsDelivr CDN and can directly be included on every page.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.alwaysdirty.min.js"></script>
```

jsDelivr also supports [on-the-fly concatenation of files](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request), so you can reference only 1 URL to get jQuery, jquery.dirtyforms, and jquery.dirtyforms.helpers.alwaysdirty in one request.
```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.dirtyforms@2.0.0(jquery.dirtyforms.min.js+jquery.dirtyforms.helpers.alwaysdirty.min.js)"></script>
```

#### Self-Hosted
Download and save one of two available files to include the Always Dirty helper to your page, either the [latest distribution](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.helpers.alwaysdirty.dist/master/jquery.dirtyforms.helpers.alwaysdirty.js) or the [latest minified](https://raw.githubusercontent.com/NightOwl888/jquery.dirtyforms.helpers.alwaysdirty.dist/master/jquery.dirtyforms.helpers.alwaysdirty.min.js) version.
```HTML
<script type="text/javascript" src="jquery.dirtyforms.helpers.alwaysdirty.min.js"></script>
```

You can also conveniently get all of the latest Dirty Forms files in one [Zip Download](https://github.com/NightOwl888/jquery.dirtyforms.dist/archive/master.zip).

#### Package Managers
The Always Dirty helper is even available through [NPM](http://npmjs.org), [Bower](http://bower.io), and [NuGet](https://www.nuget.org/). Just use one of the following commands below to install the helper, including all dependencies.

[![NPM version](https://badge.fury.io/js/jquery.dirtyforms.helpers.alwaysdirty.svg)](http://www.npmjs.org/package/jquery.dirtyforms.helpers.alwaysdirty)
[![Bower version](https://badge.fury.io/bo/jquery.dirtyforms.helpers.alwaysdirty.svg)](http://bower.io/search/?q=jquery.dirtyforms.helpers.alwaysdirty)
[![NuGet version](https://badge.fury.io/nu/jquery.dirtyforms.helpers.alwaysdirty.svg)](https://www.nuget.org/packages/jquery.dirtyforms.helpers.alwaysdirty/)

[![NPM](https://nodei.co/npm/jquery.dirtyforms.helpers.alwaysdirty.png?compact=true)](https://nodei.co/npm/jquery.dirtyforms.helpers.alwaysdirty/)
```
// NPM
$ npm install jquery.dirtyforms.helpers.alwaysdirty

// Bower
$ bower install jquery.dirtyforms.helpers.alwaysdirty

// NuGet
PM> Install-Package jquery.dirtyforms.helpers.alwaysdirty
```

## SourceMaps

A [SourceMap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?hl=en_US&pli=1&pli=1) file is also available via CDN or your favorite package manager.

#### CDN

```HTML
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.alwaysdirty.min.js.map"></script>
```

#### Package Managers

NPM, Bower, and NuGet will install the SourceMap file into the destination directory.

```
jquery.dirtyforms.helpers.alwaysdirty.min.js.map
```

## Usage

This helper is completely automatic - there are no properties or methods to interact with. Simply include the reference to the helper after the [prerequisites](#prerequisites).

```HTML
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/jquery.dirtyforms/2.0.0/jquery.dirtyforms.helpers.alwaysdirty.min.js" type="text/javascript"></script>
```

> If not using a CDN, you need to apply the dependencies in the same order as in the example above.


## Support

For help or to report a bug please [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) at the [Dirty Forms development site](https://github.com/snikch/jquery.dirtyforms/).
