![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# Contributing to Dirty Forms

Your contributions to the Dirty Forms project are welcome. While we have put a lot of time and thought into this project, we recognize that it can always be improved or extended in some way, and we appreciate the feedback. Contributions can take many forms. Here are some common ones.

1. [Opening an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) to let us know about something that appears to be defective or to give us an idea for a new feature
2. Contributing bug fixes for features you find that are defective
3. Contributing new features
4. Adding new helper or dialog modules
5. Helping to update the documentation if it is incorrect, incomplete, or out-of-date
6. Contributing unit tests/demos for existing features
7. Contributing additional distribution methods

### Issues

Please provide as much detail as possible when submitting an issue. 

If we cannot reproduce your issue, there is little chance that it will be fixed or that we will be able to provide you with a working solution. Preference will be given to issues that provide demo projects (either by posting them on GitHub or zipping them and posting them for download).

### Code Contributions

First of all, please read [Don't "Push" Your Pull Requests](http://www.igvita.com/2011/12/19/dont-push-your-pull-requests/). If you are thinking of making a change that will probably result in more than 5 changed lines of code, we would appreciate you [opening an issue](https://github.com/maartenba/MvcSiteMapProvider/issues/new) to discuss the change before you start writing. It could save both you and our team quite a bit of work if the code doesn't have to be rewritten to fit in with our overall objectives. Also, please review [Open Source Contribution Etiquette](http://tirania.org/blog/archive/2010/Dec-31.html).

In general, we like features that provide value to a large subset of users that are closely related to form validation.

### Document Your Code

We are following [semantic versioning](http://semver.org/). By definition, API members that are not documented are not taken into consideration when building for backward compatibility. Undocumented members may be removed from our codebase at any time for any reason. If you want your feature to be a permanent part of Dirty Forms, you must provide documentation for every public member that it exposes (either in the main readme or for the corresponding [helper or dialog](#helpersdialogs) readme). Besides, there is little point in contributing your "super feature" to our codebase if others cannot take advantage of it.

### Coding Conventions 

While we don't follow draconian coding practices, we ask that you do your best to follow existing conventions so the code is as consistent as possible. The code should be easy to read and understand, and should be broken into small, maintainable members that have a single purpose. Preferably, a single property or method will have no more than about 10 lines of code (including curly braces).

Please create small focused commits that each deal with a single change. If the commit is to fix an issue, please prefix the commit message with (`fixes #<issue>` or `closes #<issue>`) to automatically close the issue that is fixed. For example, if you are submitting a fix to issue `#5`, the commit message should start with `fixes #5, ` and be followed by a short accurate description of the problem that was fixed.

Please follow existing formatting practices. If your IDE will reformat the code in a major way, we suggest using a basic text editor to ensure only the code that you change is affected. Use common sense. If you want to add an event to monitor something that is happening in Dirty Forms, use the pre-existing event system (using jQuery trigger) rather than inventing your own brew.

Please test your code. Dirty Forms tends to use features that sometimes break in certain browsers. So you should test in as many browsers as you can (especially Chrome, FireFox, Internet Explorer, and Safari). You can also run some basic JavaScript linting (using JSHint) with the following commands, which will help steer you away from some common coding pitfalls.

```
npm install
npm test
```

### Helpers/Dialogs

Please follow these rules if you wish to contribute a helper or dialog module.

#### Use UMD Header

The Universal Module Definition allows others to compose plugins together by passing references (such as jQuery) to the module. We have adapted the [jqueryPluginCommonjs format](https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js), and request that you add it to your module before you submit it. If you have any doubts about how to use this on a jQuery plugin, take a look at the existing plugins.

For more information about UMD, and why it is important see the following documents.

- [UMD Project Readme](https://github.com/umdjs/umd#readme)
- [Making your jQuery plugin work better with npm tools](http://blog.npmjs.org/post/112712169830/making-your-jquery-plugin-work-better-with-npm)

#### Follow Existing Directory Structure

We have built a script to package up the modules and deploy them in a consistent way. So it is important that you follow the same directory structure for new helpers and dialogs. The below examples assume you are contributing a new helper or module called `widget`. Replace widget in each of the paths with the name of your helper.

Versioning of all helpers and dialogs will automatically be synced with Dirty Forms. Your package will automatically be deployed on jsDelivr when we do a distribution, so be sure to include it in the readme. Note that the CDN URLs in the `README.md` files will be automatically updated to the current version upon release. 

It is best to copy an existing helper or dialog and then use it as a starting point.

##### Helpers

| Directory  | Description |
| ------------- | ------------- |
| `/helpers/widget.js`  | Helper code file (required) (must be a jQuery plugin and follow the UMD)  |
| `/helpers/widget.pkg/README.md`  | Readme for your helper (required). Please provide a description, complete instructions on how to obtain and use the helper, its prerequisites, and how to install/reference via CDN. Note that if you use package managers, you can provide dependency information and the prerequisites can be installed automatically, so the documentation will be simpler.  |
| `/helpers/widget.pkg/bower.json`  | [Bower package file](http://bower.io/docs/creating-packages/) (optional). We recommend providing this unless your helper depends on a JavaScript and/or CSS module that does not exist [on Bower](http://bower.io/search/).  |
| `/helpers/widget.pkg/nuget.nuspec`  | [NuGet package file (nuspec)](https://docs.nuget.org/create/nuspec-reference) (optional). We recommend providing this unless your helper depends on a JavaScript and/or CSS module that does not exist on [NuGet Gallery](https://www.nuget.org/).  |
| `/helpers/widget.pkg/package.json`  | [NPM package file](https://docs.npmjs.com/files/package.json) (optional). We recommend providing this unless your helper depends on a JavaScript and/or CSS module that does not exist on [NPM](https://www.npmjs.com/).  |
| `/helpers/widget.pkg/LICENSE`  | License file (optional). If not provided, the MIT license file in the root of the project will be copied into your module.  |


##### Dialogs

| Directory  | Description |
| ------------- | ------------- |
| `/dialogs/widget.js`  | Dialog code file (required) (must follow the UMD)  |
| `/dialogs/widget.pkg/README.md`  | Readme for your dialog (required). Please provide a description, complete instructions on how to obtain and use the module, its prerequisites, and how to install/reference via CDN. Note that if you use package managers, you can provide dependency information and the prerequisites can be installed automatically, so the documentation will be simpler.  |
| `/dialogs/widget.pkg/bower.json`  | [Bower package file](http://bower.io/docs/creating-packages/) (optional). We recommend providing this unless your dialog depends on a JavaScript and/or CSS module that does not exist [on Bower](http://bower.io/search/).  |
| `/dialogs/widget.pkg/nuget.nuspec`  | [NuGet package file (nuspec)](https://docs.nuget.org/create/nuspec-reference) (optional). We recommend providing this unless your dialog depends on a JavaScript and/or CSS module that does not exist on [NuGet Gallery](https://www.nuget.org/).  |
| `/dialogs/widget.pkg/package.json`  | [NPM package file](https://docs.npmjs.com/files/package.json) (optional). We recommend providing this unless your dialog depends on a JavaScript and/or CSS module that does not exist on [NPM](https://www.npmjs.com/).  |
| `/dialogs/widget.pkg/LICENSE`  | License file (optional). If not provided, the MIT license file in the root of the project will be copied into your module.  |


#### Submodules

We distribute the packages through the use of Git submodules. There is no need for you to add a submodule to your contribution, we will do that for you (one that we own). But do note that the readme will be automatically copied to the distribution repository (submodule) when we do a build.