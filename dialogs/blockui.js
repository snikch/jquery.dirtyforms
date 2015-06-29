// Facebox dialog (for jQuery Dirty Forms)

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
    var df = $.DirtyForms;

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
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
        fire: function (message, title) {
            $.blockUI({
                message: '<span class="' + this.class + '">' +
                        '<h3>' + title + '</h3>' +
                        '<p>' + message + '</p>' +
                        '<span>' +
                            '<button type="button" class="dirty-continue ' + df.ignoreClass + '">' + this.continueButtonText + '</button> ' +
                            '<button type="button" class="dirty-cancel ' + df.ignoreClass + '">' + this.cancelButtonText + '</button>' +
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
        },
        bind: function () {
            var close = function (decision) {
                return function (e) {
                    if (e.type !== 'keydown' || (e.type === 'keydown' && e.keyCode === 27)) {
                        $.unblockUI();
                        decision(e);
                        return false;
                    }
                };
            };
            $(document).keydown(close(df.decidingCancel));
            $('.' + this.class + ' .dirty-cancel').click(close(df.decidingCancel));
            $('.' + this.class + ' .dirty-continue').click(close(df.decidingContinue));
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
