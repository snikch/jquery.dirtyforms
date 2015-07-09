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

    // Public Element methods ( $('form').dirtyForms('methodName', args) )
    var methods = {
        init: function (options) {
            var dirtyForms = $.DirtyForms;

            if (!state.initialized) {
                // Override any default options
                $.extend(true, $.DirtyForms, options);
                bindExit();

                // Listen for events from all fields on all forms
                $('body').on('change keyup input propertychange', dirtyForms.fieldSelector, onFieldChange)
                         .on('focus keydown', dirtyForms.fieldSelector, onFocus)
                         .on('click', ':reset', onReset);

                state.initialized = true;
            }

            // Work with all forms and descendant forms of the selector
            this.filter('form').add(this.find('form')).each(function () {
                var $form = $(this);
                dirtylog('Storing original field values for form ' + $form.attr('id'));

                var $fields = $form.find(dirtyForms.fieldSelector);
                $fields.each(function () { storeOriginalValue($(this)); });
                $form.trigger('scan.dirtyforms', [$form]);
            });
            return this;
        },
        // Returns true if any of the selected elements are dirty
        isDirty: function () {
            var nonFormSelector = ':dirty:not(form)';
            if (this.filter(nonFormSelector).length > 0 || this.find(nonFormSelector).length > 0) return true;

            var helpers = $.DirtyForms.helpers;
            for (var i = 0; i < helpers.length; i++) {
                if ('isDirty' in helpers[i] && helpers[i].isDirty(this)) {
                    return true;
                }
            }
            return false;
        },
        // Marks the element(s) and any helpers within the element not dirty.
        // If all of the fields in a form are marked not dirty, the form itself will be marked not dirty even
        // if it is not included in the selector. Also resets original values to the current state - 
        // essentially "forgetting" the node or its descendants are dirty.
        setClean: function () {
            dirtylog('setClean called');
            var dirtyForms = $.DirtyForms;

            this.not(':dirtyignored').each(function () {
                var $node = $(this);

                // Clean helpers
                $.each(dirtyForms.helpers, function (key, helper) {
                    if ('setClean' in helper) {
                        helper.setClean($node);
                    }
                });

                // Work with node and all non-ignored descendants that match the fieldSelector
                $node.filter(dirtyForms.fieldSelector).add($node.find(dirtyForms.fieldSelector)).not(':dirtyignored').each(function () {
                    var $field = $(this);

                    // Remove the dirty class
                    setDirtyStatus($field, false);

                    // Reset by storing the original value again
                    storeOriginalValue($field);
                });
            });
            return this;
        },
        // Scans the selected elements and descendants for any new fields and stores their original values.
        // Ignores any original values that had been set previously. Also resets the dirty status of all fields
        // whose ignore status has changed since the last scan.
        rescan: function () {
            dirtylog('rescan called');
            var dirtyForms = $.DirtyForms;

            return this.each(function () {
                var $node = $(this);

                if (!$node.is(':dirtyignored')) {
                    // Rescan helpers
                    $.each(dirtyForms.helpers, function (key, helper) {
                        if ('rescan' in helper) {
                            helper.rescan($node);
                        }
                    });
                }

                // Work with node and all non-ignored descendants that match the fieldSelector
                $node.filter(dirtyForms.fieldSelector).add($node.find(dirtyForms.fieldSelector)).each(function () {
                    var $field = $(this);

                    // Skip previously added fields
                    if (!hasOriginalValue($field) && !$node.is(':dirtyignored')) {
                        // Store the original value
                        storeOriginalValue($field);
                    }

                    setDirtyStatus($field, isFieldDirty($field));
                });
            });
        }
    };

    // Custom selectors $('form:dirty')
    $.extend($.expr[":"], {
        dirty: function (a) {
            return $(a).not(':dirtyignored').hasClass($.DirtyForms.dirtyClass);
        },
        dirtyignored: function (a) {
            var dirtyForms = $.DirtyForms;

            var getIgnoreSelector = function () {
                var result = dirtyForms.ignoreSelector;
                $.each(dirtyForms.helpers, function (key, obj) {
                    if ('ignoreSelector' in obj) {
                        if (result.length > 0) { result += ','; }
                        result += obj.ignoreSelector;
                    }
                });
                return result;
            };

            return $(a).closest('.' + dirtyForms.ignoreClass).length > 0 || $(a).is(getIgnoreSelector());
        }
    });

    // Public General Plugin properties and methods $.DirtyForms
    $.DirtyForms = {
        message: 'You\'ve made changes on this page which aren\'t saved. If you leave you will lose these changes.',
        title: 'Are you sure you want to do that?',
        dirtyClass: 'dirty',
        ignoreClass: 'ignoredirty',
        ignoreSelector: '',
        // exclude all HTML 4 except text and password, but include HTML 5 except search
        fieldSelector: "input:not([type='button'],[type='image'],[type='submit']," +
            "[type='reset'],[type='file'],[type='search']),select,textarea",
        watchTopDocument: false,
        choiceContinue: false,
        helpers: [],
        dialog: false,
        /*<log>*/
        debug: false,
        dirtylog: function (msg) {
            dirtylog(msg);
        },
        /*</log>*/

        choiceCommit: function (ev) {
            if (state.deciding) {
                $(document).trigger('choicecommit.dirtyforms');
                if (this.choiceContinue) {
                    this.decidingContinue(ev);
                } else {
                    this.decidingCancel(ev);
                }
                $(document).trigger('choicecommitAfter.dirtyforms');
            }
        },

        isDeciding: function () {
            return state.deciding;
        },

        decidingContinue: function (ev) {
            clearUnload(); // fix for chrome/safari
            ev.preventDefault();
            $(document).trigger('decidingcontinued.dirtyforms');
            refire(state.decidingEvent);
            state.clearDeciding();
        },

        decidingCancel: function (ev) {
            ev.preventDefault();
            $(document).trigger('decidingcancelled.dirtyforms');
            if (state.dialog && state.dialogStash && $.isFunction(this.dialog.refire)) {
                dirtylog('Refiring the dialog with stashed content');
                this.dialog.refire(state.dialogStash.html(), ev);
            }
            $(document).trigger('decidingcancelledAfter.dirtyforms');
            state.clearDeciding();
        }
    };

    // Private State Management
    var state = {
        initialized: false,
        formStash: false,
        dialogStash: false,
        deciding: false,
        decidingEvent: false,
        clearDeciding: function () {
            this.deciding = this.decidingEvent = this.dialogStash = false;
        }
    };

    var getFieldValue = function ($field) {
        var value;
        if ($field.is('select')) {
            value = '';
            $field.find('option').each(function () {
                var $option = $(this);
                if ($option.is(':selected')) {
                    if (value.length > 0) { value += ','; }
                    value += $option.val();
                }
            });
        } else if ($field.is(":checkbox,:radio")) {
            value = $field.is(':checked');
        } else {
            value = $field.val();
        }

        return value;
    };

    var storeOriginalValue = function ($field) {
        dirtylog('Storing original value for ' + $field.attr('name'));
        $field.data('df-orig', getFieldValue($field));
        var isEmpty = ($field.data('df-orig') === undefined);
        $field.data('df-empty', isEmpty);
    };

    var hasOriginalValue = function ($field) {
        return ($field.data('df-orig') !== undefined || $field.data('df-empty') === true);
    };

    var isFieldDirty = function ($field) {
        if ($field.is(':dirtyignored') || !hasOriginalValue($field)) return false;
        return (getFieldValue($field) != $field.data('df-orig'));
    };

    var setFieldStatus = function ($field) {
        if ($field.is(':dirtyignored')) return;

        // Option groups are a special case because they change more than the current element.
        if ($field.is(':radio[name]')) {
            var name = $field.attr('name'),
                $form = $field.parents('form');

            $form.find(":radio[name='" + name + "']").each(function () {
                var $radio = $(this);
                setDirtyStatus($radio, isFieldDirty($radio));
            });
        } else {
            setDirtyStatus($field, isFieldDirty($field));
        }
    };

    var setDirtyStatus = function ($field, isDirty) {
        dirtylog('Setting dirty status to ' + isDirty + ' on field ' + $field.attr('id'));
        var dirtyClass = $.DirtyForms.dirtyClass,
            $form = $field.parents('form');

        // Mark the field dirty/clean
        $field.toggleClass(dirtyClass, isDirty);
        var changed = (isDirty !== ($form.hasClass(dirtyClass) && $form.find(':dirty').length === 0));

        if (changed) {
            dirtylog('Setting dirty status to ' + isDirty + ' on form ' + $form.attr('id'));
            $form.toggleClass(dirtyClass, isDirty);

            if (isDirty) $form.trigger('dirty.dirtyforms', [$form]);
            if (!isDirty) $form.trigger('clean.dirtyforms', [$form]);
        }
    };

    // A delay to keep the key events from slowing down when changing the dirty status on the fly.
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    // For any fields added after the form was initialized, store the value when focused.
    var onFocus = function () {
        var $field = $(this);
        if (!hasOriginalValue($field)) {
            storeOriginalValue($field);
        }
    };

    var onFieldChange = function () {
        var $field = $(this);
        delay(function () { setFieldStatus($field); }, 100);
    };

    var onReset = function () {
        var $form = $(this).closest('form');
        // Need a delay here because reset is called before the state of the form is reset.
        setTimeout(function () { $form.dirtyForms('setClean'); }, 100);
    };

    var bindExit = function () {
        var inIframe = (top !== self),
            anchorSelector = 'a[href]:not([target="_blank"])';

        $(document).on('click', anchorSelector, nonCancelingBindFn)
                   .on('submit', 'form', nonCancelingBindFn);
        $(window).bind('beforeunload', beforeunloadBindFn);
        if ($.DirtyForms.watchTopDocument && inIframe) {
            $(top.document).on('click', anchorSelector, nonCancelingBindFn)
                           .on('submit', 'form', nonCancelingBindFn);
            $(top.window).bind('beforeunload', beforeunloadBindFn);
        }
    };

    var clearUnload = function () {
        // I'd like to just be able to unbind this but there seems
        // to be a bug in jQuery which doesn't unbind onbeforeunload
        dirtylog('Clearing the beforeunload event');
        $(window).unbind('beforeunload', beforeunloadBindFn);
        window.onbeforeunload = null;
        $(document).trigger('beforeunload.dirtyforms');
    };

    var nonCancelingBindFn = function (ev) {
        bindFn(ev);
    };

    var beforeunloadBindFn = function (ev) {
        var result = bindFn(ev);

        if (result && state.doubleunloadfix !== true) {
            dirtylog('Before unload will be called, resetting');
            state.deciding = false;
        }

        state.doubleunloadfix = true;
        setTimeout(function () { state.doubleunloadfix = false; }, 200);

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
        var $element = $(ev.target),
            eventType = ev.type,
            dirtyForms = $.DirtyForms;
        dirtylog('Entering: Leaving Event fired, type: ' + eventType + ', element: ' + ev.target + ', class: ' + $element.attr('class') + ' and id: ' + ev.target.id);

        // Important: Do this check before calling clearUnload()
        if (ev.isDefaultPrevented()) {
            dirtylog('Leaving: Event has been stopped elsewhere');
            return false;
        }

        if (eventType == 'beforeunload' && state.doubleunloadfix) {
            dirtylog('Skip this unload, Firefox bug triggers the unload event multiple times');
            state.doubleunloadfix = false;
            return false;
        }

        if ($element.is(':dirtyignored')) {
            dirtylog('Leaving: Element has ignore class or a descendant of an ignored element');
            clearUnload();
            return false;
        }

        if (state.deciding) {
            dirtylog('Leaving: Already in the deciding process');
            return false;
        }

        if (!$('form').dirtyForms('isDirty')) {
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
            dirtylog('Returning to beforeunload browser handler with: ' + dirtyForms.message);
            return dirtyForms.message;
        }
        if (!dirtyForms.dialog) return;

        // Using the GUI dialog...
        state.deciding = true;
        state.decidingEvent = ev;
        dirtylog('Setting deciding active');

        if ($.isFunction(dirtyForms.dialog.stash)) {
            dirtylog('Saving dialog content');
            state.dialogStash = dirtyForms.dialog.stash();
            dirtylog(state.dialogStash);
        }

        ev.preventDefault();
        ev.stopImmediatePropagation();

        if (typeof dirtyForms.dialog.selector === 'string' && $element.is('form') && $element.parents(dirtyForms.dialog.selector).length > 0) {
            dirtylog('Stashing form');
            state.formStash = $element.clone(true).hide();
        } else {
            state.formStash = false;
        }

        dirtylog('Deferring to the dialog');
        dirtyForms.dialog.fire(dirtyForms.message, dirtyForms.title);
        if ($.isFunction(dirtyForms.dialog.bind))
            dirtyForms.dialog.bind();
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
            if (state.formStash) {
                dirtylog('Appending stashed form to body');
                target = state.formStash;
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
        if (!$.DirtyForms.debug) return;
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
