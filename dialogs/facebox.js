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
        stashSelector: '#facebox .content',
        open: function (choice, message, ignoreClass) {
            ignoreClass = ignoreClass || $.DirtyForms.ignoreClass;

            var content =
                '<h1>' + this.title + '</h1>' +
                '<p>' + message + '</p>' +
                '<p>' +
                    '<a href="#" class="dirty-continue ' + ignoreClass + ' ' + this.continueButtonClass + '">' + this.continueButtonText + '</a>' +
                    '<a href="#" class="dirty-cancel ' + ignoreClass + ' ' + this.cancelButtonClass + '">' + this.cancelButtonText + '</a>' +
                '</p>';
            $.facebox(content);

            // Bind Events
            choice.bindEnterKey = true;
            choice.cancelSelector = '#facebox .dirty-cancel, #facebox .close, #facebox_overlay';
            choice.continueSelector = '#facebox .dirty-continue';

            // Support for Dirty Forms < 2.0
            if (choice.isDF1) {
                var close = function (decision) {
                    return function (e) {
                        if (e.type !== 'keydown' || (e.type === 'keydown' && e.keyCode === 27)) {
                            $(document).trigger('close.facebox');
                            decision(e);
                        }
                    };
                };
                var decidingCancel = $.DirtyForms.decidingCancel;
                $(document).bind('keydown.facebox', close(decidingCancel));
                $(choice.cancelSelector).click(close(decidingCancel));
                $(choice.continueSelector).click(close($.DirtyForms.decidingContinue));
            }
        },
        close: function (continuing, unstashing) {
            if (!unstashing) {
                $(document).trigger('close.facebox');
            }
        },
        stash: function () {
            var fb = $('#facebox');
            return ($.trim(fb.html()) === '' || fb.css('display') != 'block') ?
               false :
               $('#facebox .content').children().clone(true);
        },
        unstash: function (stash, ev) {
            $.facebox(stash);
        },

        // Support for Dirty Forms < 2.0
        fire: function (message, title) {
            this.title = title;
            this.open({ isDF1: true }, message);
        },
        selector: $.DirtyForms.dialog.stashSelector,

        // Support for Dirty Forms < 1.2
        bind: function () {
        },
        refire: function (content, ev) {
            this.unstash(content, ev);
        }
    };

}));
