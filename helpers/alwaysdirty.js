/*!
Always dirty helper module (for jQuery Dirty Forms) | v2.0.0 | github.com/snikch/jquery.dirtyforms
(c) 2012-2016 Mal Curtis
License MIT
*/

// Example helper, the form is always considered dirty

/*<iife_head>*/
// Support for UMD: https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
// See: http://blog.npmjs.org/post/112712169830/making-your-jquery-plugin-work-better-with-npm for details.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'window', 'document'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'), window, document);
    } else {
        // Browser globals
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    /*</iife_head>*/
    // Can't use ECMAScript 5's strict mode because several apps 
    // including ASP.NET trace the stack via arguments.caller.callee 
    // and Firefox dies if you try to trace through "use strict" call chains. 
    // See jQuery issue (#13335)
    // Support: Firefox 18+
    //"use strict";

    // Create a new object, with an isDirty method
    var alwaysDirty = {
        isDirty: function (node) {
            // Perform dirty check on a given node (usually a form element)	
            return true;
        }
    };
    // Push the new object onto the helpers array
    $.DirtyForms.helpers.push(alwaysDirty);

    /*<iife_foot>*/
}));
/*</iife_foot>*/
