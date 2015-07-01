/*!
Dirty Forms jQuery Plugin | v1.2.0 | github.com/snikch/jquery.dirtyforms
(c) 2010-2015 Mal Curtis
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

    if (!$.fn.on) {
        // Patch jQuery 1.4.2 - 1.7 with an on function (that uses delegate).
        $.fn.on = function (events, selector, data, handler) {
            return this.delegate(selector, events, data, handler);
        };
    }

    // Public General Plugin methods $.DirtyForms
    $.extend({
        DirtyForms: {
            message: 'You\'ve made changes on this page which aren\'t saved. If you leave you will lose these changes.',
            title: 'Are you sure you want to do that?',
            dirtyClass: 'dirty',
            listeningClass: 'dirtylisten',
            ignoreClass: 'ignoredirty',
            choiceContinue: false,
            helpers: [],
            dialog: false,
            /*<log>*/
            debug: false,
            dirtylog: function (msg) {
                dirtylog(msg);
            },
            /*</log>*/

            isDirty: function () {
                return $(':dirtylistening').dirtyForms('isDirty');
            },

            // DEPRECATED: Duplicate functionality.
            // Use $('html').addClass($.DirtyForms.ignoreClass); instead.
            disable: function () {
                $('html').addClass(settings.ignoreClass);
            },

            ignoreParentDocs: function () {
                settings.watchParentDocs = false;
            },

            choiceCommit: function (ev) {
                if (settings.deciding) {
                    $(document).trigger('choicecommit.dirtyforms');
                    if (settings.choiceContinue) {
                        settings.decidingContinue(ev);
                    } else {
                        settings.decidingCancel(ev);
                    }
                    $(document).trigger('choicecommitAfter.dirtyforms');
                }
            },

            isDeciding: function () {
                return settings.deciding;
            },

            decidingContinue: function (ev) {
                clearUnload(); // fix for chrome/safari
                ev.preventDefault();
                $(document).trigger('decidingcontinued.dirtyforms');
                refire(settings.decidingEvent);
                clearDecidingState();
            },

            decidingCancel: function (ev) {
                ev.preventDefault();
                $(document).trigger('decidingcancelled.dirtyforms');
                if (settings.dialog && settings.dialogStash && $.isFunction(settings.dialog.refire)) {
                    dirtylog('Refiring the dialog with stashed content');
                    settings.dialog.refire(settings.dialogStash.html(), ev);
                }
                $(document).trigger('decidingcancelledAfter.dirtyforms');
                clearDecidingState();
            }
        }
    });

    // Create a custom selector $('form:dirty')
    $.extend($.expr[":"], {
        dirtylistening: function (a) {
            return $(a).hasClass(settings.listeningClass);
        },
        dirty: function (a) {
            return $(a).hasClass(settings.dirtyClass);
        }
    });

    // Public Element methods ( $('form').dirtyForms('methodName', args) )
    var methods = {
        init: function () {
            dirtylog('Adding forms to watch');
            bindExit();

            // exclude all HTML 4 except text and password, but include HTML 5 except search
            var inputSelector = "textarea,input:not([type='checkbox'],[type='radio'],[type='button']," +
        		"[type='image'],[type='submit'],[type='reset'],[type='file'],[type='search'])";

            // Initialize settings with the currently focused element (HTML 5 autofocus)
            var $focused = $(document.activeElement);
            if ($focused.is(inputSelector)) {
                settings.focused.element = $focused;
                settings.focused.value = $focused.val();
            }

            return this.filter('form').each(function () {
                dirtylog('Adding form ' + $(this).attr('id') + ' to forms to watch');
                $(this).addClass(settings.listeningClass)
                    .on('focus change', inputSelector, onFocus)
                    .on('change', "input[type='checkbox'],input[type='radio'],select", onSelectionChange)
                    .on('click', "input[type='reset']", onReset);
            });
        },
        // Returns true if any of the supplied elements are dirty
        isDirty: function () {
            if (focusedIsDirty() || this.hasClass(settings.dirtyClass)) return true;

            var helpers = settings.helpers;
            for (var i = 0; i < helpers.length; i++) {
                if ('isDirty' in helpers[i] && helpers[i].isDirty(this)) {
                    return true;
                }
            }
            return false;
        },
        // Marks the element(s) that match the selector (and their parent form) dirty
        setDirty: function () {
            dirtylog('setDirty called');
            return this.each(function (e) {
                var $form = $(this).closest('form');
                var changed = !$form.hasClass(settings.dirtyClass);
                $(this).addClass(settings.dirtyClass);
                if (changed) {
                    $form.addClass(settings.dirtyClass)
                         .trigger('dirty.dirtyforms', [$form]);
                }
            });
        },
        // "Cleans" this dirty form by essentially forgetting that it is dirty
        setClean: function () {
            dirtylog('setClean called');
            settings.focused = { element: false, value: false };

            return this.each(function (e) {
                var node = this, $node = $(this);

                // Clean helpers
                $.each(settings.helpers, function (key, obj) {
                    if ("setClean" in obj) {
                        obj.setClean(node);
                    }
                });

                // remove the current dirty class
                $node.removeClass(settings.dirtyClass);

                if ($node.is('form')) {
                    // remove all dirty classes from children
                    $node.find(':dirty').removeClass(settings.dirtyClass);
                    $node.trigger('clean.dirtyforms', [$node]);
                } else {
                    // if this is last dirty child, set form clean
                    var $form = $node.parents('form');
                    if ($form.find(':dirty').length === 0 && $form.hasClass(settings.dirtyClass)) {
                        $form.removeClass(settings.dirtyClass)
                             .trigger('clean.dirtyforms', [$form]);
                    }
                }
            });
        }

        // ADD NEW METHODS HERE
    };

    $.fn.dirtyForms = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.dirtyForms');
        }
    };

    // Private Properties and Methods
    var settings = $.DirtyForms = $.extend({
        watchParentDocs: true,
        exitBound: false,
        formStash: false,
        dialogStash: false,
        deciding: false,
        decidingEvent: false,
        focused: { "element": false, "value": false }
    }, $.DirtyForms);

    var clearDecidingState = function () {
        settings.deciding = settings.decidingEvent = settings.dialogStash = false;
    };

    var onReset = function () {
        $(this).parents('form').dirtyForms('setClean');
    };

    var onSelectionChange = function () {
        if (isIgnored($(this))) return;
        $(this).dirtyForms('setDirty');
    };

    var onFocus = function () {
        var $this = $(this);
        if (focusedIsDirty() && !isIgnored($this)) {
            settings.focused.element.dirtyForms('setDirty');
        }
        settings.focused.element = $this;
        settings.focused.value = $this.val();
    };

    var focusedIsDirty = function () {
        // Check, whether the value of focused element has changed
        return settings.focused.element &&
			(settings.focused.element.val() !== settings.focused.value);
    };

    var bindExit = function () {
        if (settings.exitBound) return;
        var inIframe = (top !== self);

        $(document).on('click', 'a[href]', aBindFn)
                   .on('submit', 'form', bindFn);
        $(window).bind('beforeunload', beforeunloadBindFn);
        if (settings.watchParentDocs && inIframe) {
            $(top.document).on('click', 'a[href]', aBindFn)
                           .on('submit', 'form', bindFn);
            $(top.window).bind('beforeunload', beforeunloadBindFn);
        }

        settings.exitBound = true;
    };

    var getIgnoreAnchorSelector = function () {
        var result = '';
        $.each(settings.helpers, function (key, obj) {
            if ("ignoreAnchorSelector" in obj) {
                if (result.length > 0) { result += ','; }
                result += obj.ignoreAnchorSelector;
            }
        });
        return result;
    };

    var aBindFn = function (ev) {
        if (!$(this).is(getIgnoreAnchorSelector()) && !isDifferentTarget($(this))) {
            bindFn(ev);
        }
    };

    var beforeunloadBindFn = function (ev) {
        var result = bindFn(ev);

        if (result && settings.doubleunloadfix !== true) {
            dirtylog('Before unload will be called, resetting');
            settings.deciding = false;
        }

        settings.doubleunloadfix = true;
        setTimeout(function () { settings.doubleunloadfix = false; }, 200);

        // Bug Fix: Only return the result if it is a string,
        // otherwise don't return anything.
        if (typeof (result) == 'string') {
            ev = ev || window.event;

            // For IE and Firefox prior to version 4
            if (ev) {
                ev.returnValue = result;
            }

            // For Safari
            return result;
        }
    };

    var bindFn = function (ev) {
        var $element = $(ev.target), eventType = ev.type;
        dirtylog('Entering: Leaving Event fired, type: ' + eventType + ', element: ' + ev.target + ', class: ' + $element.attr('class') + ' and id: ' + ev.target.id);

        // Important: Do this check before calling clearUnload()
        if (ev.isDefaultPrevented()) {
            dirtylog('Leaving: Event has been stopped elsewhere');
            return false;
        }

        if (eventType == 'beforeunload' && settings.doubleunloadfix) {
            dirtylog('Skip this unload, Firefox bug triggers the unload event multiple times');
            settings.doubleunloadfix = false;
            return false;
        }

        if (isIgnored($element)) {
            dirtylog('Leaving: Element has ignore class or a descendant of an ignored element');
            clearUnload();
            return false;
        }

        if (settings.deciding) {
            dirtylog('Leaving: Already in the deciding process');
            return false;
        }

        if (!settings.isDirty()) {
            dirtylog('Leaving: Not dirty');
            clearUnload();
            return false;
        }

        if (eventType == 'submit' && $element.dirtyForms('isDirty')) {
            dirtylog('Leaving: Form submitted is a dirty form');
            clearUnload();
            return true;
        }

        // Callback for page access in current state
        $(document).trigger('defer.dirtyforms');

        if (eventType == 'beforeunload') {
            dirtylog('Returning to beforeunload browser handler with: ' + settings.message);
            return settings.message;
        }
        if (!settings.dialog) return;

        // Using the GUI dialog...
        settings.deciding = true;
        settings.decidingEvent = ev;
        dirtylog('Setting deciding active');

        if ($.isFunction(settings.dialog.stash)) {
            dirtylog('Saving dialog content');
            settings.dialogStash = settings.dialog.stash();
            dirtylog(settings.dialogStash);
        }

        ev.preventDefault();
        ev.stopImmediatePropagation();

        if (typeof settings.dialog.selector === 'string' && $element.is('form') && $element.parents(settings.dialog.selector).length > 0) {
            dirtylog('Stashing form');
            settings.formStash = $element.clone(true).hide();
        } else {
            settings.formStash = false;
        }

        dirtylog('Deferring to the dialog');
        settings.dialog.fire(settings.message, settings.title);
        if ($.isFunction(settings.dialog.bind))
            settings.dialog.bind();
    };

    var isDifferentTarget = function ($element) {
        var aTarget = $element.attr('target');
        return typeof aTarget === 'string' ? aTarget.toLowerCase() === '_blank' : false;
    };

    var isIgnored = function ($element) {
        return $element.closest('.' + settings.ignoreClass).length > 0;
    };

    var clearUnload = function () {
        // I'd like to just be able to unbind this but there seems
        // to be a bug in jQuery which doesn't unbind onbeforeunload
        dirtylog('Clearing the beforeunload event');
        $(window).unbind('beforeunload', beforeunloadBindFn);
        window.onbeforeunload = null;
        $(document).trigger('beforeunload.dirtyforms');
    };

    var refire = function (e) {
        $(document).trigger('beforeRefire.dirtyforms');
        if (e.type === 'click') {
            dirtylog("Refiring click event");
            var event = new $.Event('click');
            $(e.target).trigger(event);
            if (!event.isDefaultPrevented()) {
                var href = $(e.target).closest('[href]').attr('href');
                dirtylog('Sending location to ' + href);
                location.href = href;
                return;
            }
        } else {
            dirtylog("Refiring " + e.type + " event on " + e.target);
            var target;
            if (settings.formStash) {
                dirtylog('Appending stashed form to body');
                target = settings.formStash;
                $('body').append(target);
            }
            else {
                target = $(e.target).closest('form');
            }
            target.trigger(e.type);
        }
    };

    /*<log>*/
    var dirtylog = function (msg) {
        if (!settings.debug) return;
        var hasFirebug = 'console' in window && 'firebug' in window.console,
            hasConsoleLog = 'console' in window && 'log' in window.console;
        msg = '[DirtyForms] ' + msg;
        if (hasFirebug) {
            console.log(msg);
        } else if (hasConsoleLog) {
            window.console.log(msg);
        } else {
            alert(msg);
        }
    };
    /*</log>*/

}));
