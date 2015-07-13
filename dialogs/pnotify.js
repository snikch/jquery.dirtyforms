/*!
PNotify dialog module (for jQuery Dirty Forms) | v1.2.0 | github.com/snikch/jquery.dirtyforms
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

    var modal_overlay,
        notice,
        isPN2 = typeof PNotify === 'function';

    $.DirtyForms.dialog = {

        // Custom properties and methods to allow overriding (may differ per dialog)
        title: 'Are you sure you want to do that?',
        class: 'dirty-dialog',
        continueButtonText: 'Leave This Page',
        cancelButtonText: 'Stay Here',
        styling: 'bootstrap3',
        width: '330',

        // Typical Dirty Forms Properties and Methods
        fire: function (message) {
            var content = {
                title: this.title,
                hide: false,
                styling: this.styling,
                width: this.width,

                // 2.x hide closer and sticker
                buttons: {
                    closer: false,
                    sticker: false
                },
                // 1.x hide closer and sticker
                closer: false,
                sticker: false,

                text: '<span class="' + this.class + '">' +
                        '<p>' + message + '</p>' +
                        '<span style="display:block;text-align:center;">' +
                            '<button type="button" class="dirty-continue ' + $.DirtyForms.ignoreClass + '">' + this.continueButtonText + '</button> ' +
                            '<button type="button" class="dirty-cancel ' + $.DirtyForms.ignoreClass + '">' + this.cancelButtonText + '</button>' +
                        '</span>' +
                    '</span>',
                before_open: function (PNotify) {
                    if (isPN2) {
                        // Position this notice in the center of the screen.
                        PNotify.get().css({
                            "top": ($(window).height() / 2) - (PNotify.get().height() / 2),
                            "left": ($(window).width() / 2) - (PNotify.get().width() / 2)
                        });
                    }

                    // Make a modal screen overlay.
                    if (modal_overlay) modal_overlay.fadeIn("fast");
                    else modal_overlay = $("<div />", {
                        "class": "ui-widget-overlay",
                        "css": {
                            "display": "none",
                            "position": "fixed",
                            "top": "0",
                            "bottom": "0",
                            "right": "0",
                            "left": "0"
                        }
                    }).appendTo("body").fadeIn("fast");
                }
            };

            // Patch for PNotify 1.x
            notice = isPN2 ? new PNotify(content) : $.pnotify(content);
        },
        bind: function () {
            var close = function (decision) {
                return function (e) {
                    if (e.type !== 'keydown' || (e.type === 'keydown' && e.keyCode === 27)) {
                        $(document).trigger('close.facebox');
                        notice.remove();
                        modal_overlay.fadeOut("fast");
                        decision(e);
                        return false;
                    }
                };
            };
            // Trap the escape key and force a close. Cancel it so PNotify doesn't intercept it.
            $(document).keydown(close($.DirtyForms.decidingCancel));
            $('.dirty-cancel,.ui-widget-overlay').click(close($.DirtyForms.decidingCancel));
            $('.dirty-continue').click(close($.DirtyForms.decidingContinue));
        },

        // Support for Dirty Forms < 1.2
        stash: function () {
            return false;
        },
        refire: function () {
            return false;
        },
        selector: 'no-op'
    };

}));