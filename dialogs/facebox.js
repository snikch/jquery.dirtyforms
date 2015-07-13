/*!
Facebox dialog module (for jQuery Dirty Forms) | v1.2.0 | github.com/snikch/jquery.dirtyforms
(c) 2015 Shad Storhaug
License MIT
*/

// Support for UMD: https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
// This allows for tools such as Browserify to compose the components together into a single HTTP request.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'), window, document);
    } else {
        // Browser globals
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    // Use ECMAScript 5's strict mode
    "use strict";

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
        title: 'Are you sure you want to do that?',
        continueButtonClass: 'button medium red',
        continueButtonText: 'Leave This Page',
        cancelButtonClass: 'button medium',
        cancelButtonText: 'Stay Here',

        // Typical Dirty Forms Properties and Methods

        // Selector for stashing the content of another dialog.
        selector: '#facebox .content',
        fire: function (message) {
            var content = '<h1>' + this.title + '</h1><p>' + message + '</p>' +
                '<p>' +
                    '<a href="#" class="continue ' + $.DirtyForms.ignoreClass + ' ' + this.continueButtonClass + '">' + this.continueButtonText + '</a>' +
                    '<a href="#" class="cancel ' + $.DirtyForms.ignoreClass + ' ' + this.cancelButtonClass + '">' + this.cancelButtonText + '</a>' +
                '</p>';
            $.facebox(content);
        },
        bind: function () {
            var close = function (decision) {
                return function (e) {
                    if (e.type !== 'keydown' || (e.type === 'keydown' && e.keyCode === 27)) {
                        $(document).trigger('close.facebox');
                        decision(e);
                    }
                };
            };
            $(document).bind('keydown.facebox', close($.DirtyForms.decidingCancel));
            $('#facebox .cancel, #facebox .close, #facebox_overlay').click(close($.DirtyForms.decidingCancel));
            $('#facebox .continue').click(close($.DirtyForms.decidingContinue));
        },
        stash: function () {
            var fb = $('#facebox');
            return ($.trim(fb.html()) === '' || fb.css('display') != 'block') ?
               false :
               $('#facebox .content').clone(true);
        },
        refire: function (content, ev) {
            $.facebox(content);
        }
    };

}));
