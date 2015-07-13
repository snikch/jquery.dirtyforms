/*!
Bootstrap modal dialog (for jQuery Dirty Forms) | v1.2.0 | github.com/snikch/jquery.dirtyforms
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

    $.DirtyForms.dialog = {
        // Custom properties and methods to allow overriding (may differ per dialog)
        title: 'Are you sure you want to do that?',
        continueButtonClass: 'dirty-continue',
        continueButtonText: 'Leave This Page',
        cancelButtonClass: 'dirty-cancel',
        cancelButtonText: 'Stay Here',
        dialogID: 'dirty-dialog',
        titleID: 'dirty-title',
        messsageClass: 'dirty-message',
        replaceText: true,

        // Typical Dirty Forms Properties and Methods
        fire: function (message) {
            // Look for a pre-existing element with the dialogID.
            var $dialog = $('#' + this.dialogID);

            // If the user already added a dialog with this ID, skip doing it here
            if ($dialog.length === 0) {
                // NOTE: Buttons don't have the ignore class because Bootstrap 3 isn't compatible
                // with old versions of jQuery that don't properly cancel the click events.
                $dialog =
                    $('<div id="' + this.dialogID + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="' + this.titleID + '">' +
                        '<div class="modal-dialog" role="document">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                    '<h3 class="modal-title" id="' + this.titleID + '"></h3>' +
                                '</div>' +
                                '<div class="modal-body ' + this.messsageClass + '"></div>' +
                                '<div class="modal-footer">' +
                                    '<button type="button" class="' + this.continueButtonClass + ' btn btn-primary" data-dismiss="modal"></button>' +
                                    '<button type="button" class="' + this.cancelButtonClass + ' btn btn-default" data-dismiss="modal"></button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');

                // Append to the body so we can capture DOM events.
                // Flag the dialog for later removal.
                $('body').append($dialog)
                         .data('df-dialog-appended', true);
            }

            if (this.replaceText) {
                // Replace the text in the dialog (whether it is external or not).
                $dialog.find('#' + this.titleID).html(this.title);
                $dialog.find('.' + this.messsageClass).html(message);
                $dialog.find('.' + this.continueButtonClass).html(this.continueButtonText);
                $dialog.find('.' + this.cancelButtonClass).html(this.cancelButtonText);
            }

            // Bind the events
            $dialog.find('.' + this.continueButtonClass).click(function (e) {
                $.DirtyForms.choiceContinue = true;
            });
            $dialog.on('hidden.bs.modal', function (e) {
                $.DirtyForms.choiceCommit(e);
                if ($('body').data('df-dialog-appended') === true) {
                    $dialog.remove();
                }
            });

            // Show the dialog
            $dialog.modal({ show: true });
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
        selector: 'no-op',
    };

}));
