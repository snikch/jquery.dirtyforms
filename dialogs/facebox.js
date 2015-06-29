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
        continueButtonClass: 'button medium red',
        continueButtonText: 'Continue',
        cancelButtonClass: 'button medium',
        cancelButtonText: 'Stop',

        // Typical Dirty Forms Properties and Methods

        // Selector for stashing the content of another dialog.
        selector: '#facebox .content',
        fire: function (message, title) {
            var content = '<h1>' + title + '</h1><p>' + message + '</p>' +
                '<p>' +
                    '<a href="#" class="continue ' + df.ignoreClass + ' ' + this.continueButtonClass + '">' + this.continueButtonText + '</a>' +
                    '<a href="#" class="cancel ' + df.ignoreClass + ' ' + this.cancelButtonClass + '">' + this.cancelButtonText + '</a>' +
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
            $(document).bind('keydown.facebox', close(df.decidingCancel));
            $('#facebox .cancel, #facebox .close, #facebox_overlay').click(close(df.decidingCancel));
            $('#facebox .continue').click(close(df.decidingContinue));
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
