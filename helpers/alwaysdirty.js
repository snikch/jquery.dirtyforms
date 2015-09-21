/*!
Always dirty helper module (for jQuery Dirty Forms) | v2.0.0-beta00004 | github.com/snikch/jquery.dirtyforms
(c) 2015 Mal Curtis
License MIT
*/

// Example helper, the form is always considered dirty

// Support for UMD: https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
// This allows for tools such as Browserify to compose the components together into a single HTTP request.
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
    // Use ECMAScript 5's strict mode
    "use strict";

    // Create a new object, with an isDirty method
    var alwaysDirty = {
        isDirty: function (node) {
            // Perform dirty check on a given node (usually a form element)	
            return true;
        }
    };
    // Push the new object onto the helpers array
    $.DirtyForms.helpers.push(alwaysDirty);
}));
