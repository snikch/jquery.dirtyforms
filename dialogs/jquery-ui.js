/*!
jQuery UI dialog module (for jQuery Dirty Forms) | v1.2.0 | github.com/snikch/jquery.dirtyforms
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

    // Create a local reference for simplicity
    var $dialog = $('<div style="display:none;" />');

    $('body').append($dialog);

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
        title: 'Are you sure you want to do that?',
        continueButtonText: 'Leave This Page',
        cancelButtonText: 'Stay Here',
        width: 400,

        // Typical Dirty Forms Properties and Methods
        fire: function (message) {
            $dialog.dialog({ title: this.title, width: this.width, modal: true });
            $dialog.html(message);
        },
        bind: function () {
            $dialog.dialog('option', 'buttons',
                [
                    {
                        text: this.continueButtonText,
                        click: function () {
                            $.DirtyForms.choiceContinue = true;
                            $(this).dialog('close');
                        }
                    },
                    {
                        text: this.cancelButtonText,
                        click: function () {
                            $(this).dialog('close');
                        }
                    }
                ]
            ).bind('dialogclose', function (e) {
                $.DirtyForms.choiceCommit(e);
            });

            // Trap the escape key and force a close. Cancel it so jQuery UI doesn't intercept it.
            // This will fire the dialogclose event to commit the choice (which defaults to false).
            $(document).keydown(function (e) {
                if (e.keyCode == 27) {
                    e.preventDefault();
                    $dialog.dialog('close');
                    return false;
                }
            });
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
