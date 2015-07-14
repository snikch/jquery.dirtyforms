/*!
BlockUI dialog module (for jQuery Dirty Forms) | v1.2.0 | github.com/snikch/jquery.dirtyforms
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
        class: 'dirty-dialog',
        continueButtonText: 'Leave This Page',
        cancelButtonText: 'Stay Here',
        width: '400px',
        padding: '10px',
        color: '#000',
        border: '3px solid #aaa',
        backgroundColor: '#fff',
        overlayOpacity: 0.5,

        // Typical Dirty Forms Properties and Methods
        fire: function (message) {
            $.blockUI({
                message: '<span class="' + this.class + '">' +
                        '<h3>' + this.title + '</h3>' +
                        '<p>' + message + '</p>' +
                        '<span>' +
                            '<button type="button" class="dirty-continue ' + $.DirtyForms.ignoreClass + '">' + this.continueButtonText + '</button> ' +
                            '<button type="button" class="dirty-cancel ' + $.DirtyForms.ignoreClass + '">' + this.cancelButtonText + '</button>' +
                        '</span>' +
                    '</span>',
                css: {
                    width: this.width,
                    padding: this.padding,
                    color: this.color,
                    border: this.border,
                    backgroundColor: this.backgroundColor,
                    cursor: 'auto'
                },
                overlayCSS: {
                    cursor: 'auto',
                    opacity: this.overlayOpacity
                }
            });

            // Bind Events
            var close = function (decision) {
                return function (e) {
                    if (e.type !== 'keydown' || (e.type === 'keydown' && e.keyCode === 27)) {
                        $.unblockUI();
                        decision(e);
                        return false;
                    }
                };
            };
            $(document).keydown(close($.DirtyForms.decidingCancel));
            $('.' + this.class + ' .dirty-cancel').click(close($.DirtyForms.decidingCancel));
            $('.' + this.class + ' .dirty-continue').click(close($.DirtyForms.decidingContinue));
        },

        // Support for Dirty Forms < 1.2
        bind: function () {
        },
        stash: function () {
            return false;
        },
        refire: function () {
            return false;
        },
        selector: 'no-op'
    };

}));
