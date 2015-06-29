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
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    // Create a local reference for simplicity
    var df = $.DirtyForms,
        dlg = $('<div style="display:none;" />');

    $('body').append(dlg);

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
        continueButtonText: 'Leave This Page',
        cancelButtonText: 'Stay Here',
        width: 400,

        // Typical Dirty Forms Properties and Methods
        fire: function (message, dlgTitle) {
            dlg.dialog({ title: dlgTitle, width: this.width, modal: true });
            dlg.html(message);
        },
        bind: function () {
            dlg.dialog('option', 'buttons',
                [
                    {
                        text: this.continueButtonText,
                        click: function () {
                            df.choiceContinue = true;
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
            ).bind('dialogclose', df.choiceCommit);

            // Trap the escape key and force a close. Cancel it so jQuery UI doesn't intercept it.
            // This will fire the dialogclose event to commit the choice (which defaults to false).
            $(document).keydown(function (e) {
                if (e.keyCode == 27) {
                    e.preventDefault();
                    dlg.dialog('close');
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
