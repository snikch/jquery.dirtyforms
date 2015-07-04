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
            if (!state.initialized) {
                // Override any default options
                $.extend(true, $.DirtyForms, options);
                bindExit();

                state.initialized = true;
            }

            var dirtyForms = $.DirtyForms;
            dirtylog('Adding forms to watch');

            return this.filter('form').each(function () {
                var $form = $(this);
                if (!$form.is(':dirtylistening')) {
                    var $fields = $form.find(dirtyForms.fieldSelector);
                    $fields.each(function () { storeOriginalValue($(this)); });
                    $form.trigger('scan.dirtyforms', [$form]);

                    dirtylog('Adding form ' + $form.attr('id') + ' to forms to watch');
                    $form.addClass(dirtyForms.listeningClass)
                        .on('change keyup input propertychange', dirtyForms.fieldSelector, onFieldChange)
                        .on('focus', dirtyForms.fieldSelector, onFocus)
                        .on('click', "input[type='reset']", onReset);
                }
            });
        },
        // Returns true if any of the supplied elements are dirty
        isDirty: function () {
            var dirtyForms = $.DirtyForms;
            if (isIgnored(this)) return false;
            if (this.hasClass(dirtyForms.dirtyClass)) return true;

            var helpers = dirtyForms.helpers;
            for (var i = 0; i < helpers.length; i++) {
                if ('isDirty' in helpers[i] && helpers[i].isDirty(this)) {
                    return true;
                }
            }
            return false;
        },
        // Scans the selected form(s) for any fields that were added dynamically 
        // and tracks their original values.
        scan: function () {
            return this.filter('form').each(function () {
                var $form = $(this);
                if (!$form.is(':dirtylistening')) {
                    dirtylog('Scanning form ' + $form.attr('id') + ' for new fields');
                    var $fields = $form.find($.DirtyForms.fieldSelector);
                    $fields.each(function () {
                        var $field = $(this);
                        if (!hasOriginalValue($field)) {
                            dirtylog('Start tracking field value of ' + $field.attr('name'));
                            storeOriginalValue($field);
                        }
                    });
                    $form.trigger('scan.dirtyforms', [$form]);
                }
            });
        },
        // Forgets the current dirty state and considers any changes 
        // after this point to be dirty.
        snapShot: function () {
            return this.filter('form').each(function () {
                var $form = $(this);
                if (!$form.is(':dirtylistening')) {
                    dirtylog('Taking snapshot of form ' + $form.attr('id'));
                    var $fields = $form.find($.DirtyForms.fieldSelector);
                    $fields.each(function () {
                        storeOriginalValue($(this));
                    });
                    setClean($form);
                    $form.trigger('snapshot.dirtyforms', [$form]);
                }
            });
        }
    };

    // Custom selectors $('form:dirty')
    $.extend($.expr[":"], {
        dirtylistening: function (a) {
            return $(a).hasClass($.DirtyForms.listeningClass);
        },
        dirty: function (a) {
            return $(a).hasClass($.DirtyForms.dirtyClass);
        }
    });

    // Public General Plugin properties and methods $.DirtyForms
    $.DirtyForms = {
        message: 'You\'ve made changes on this page which aren\'t saved. If you leave you will lose these changes.',
        title: 'Are you sure you want to do that?',
        dirtyClass: 'dirty',
        listeningClass: 'dirtylisten',
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

        isDirty: function () {
            return $(':dirtylistening').dirtyForms('isDirty');
        },

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
        if (isIgnored($field)) return null;

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
        } else if ($field.is("[type='checkbox'],[type='radio']")) {
            value = $field.is(':checked');
        } else {
            value = $field.val();
        }

        return value;
    };

    var storeOriginalValue = function ($field) {
        $field.data('df-orig', getFieldValue($field));
        var isEmpty = (typeof $field.data('df-orig') === 'undefined');
        $field.data('df-empty', isEmpty);
    };

    var hasOriginalValue = function ($field) {
        return ($field.data('df-orig') || !$field.data('df-empty'));
    };

    var isFieldDirty = function ($field) {
        if (isIgnored($field) || !hasOriginalValue($field)) return false;
        return (getFieldValue($field) != $field.data('df-orig'));
    };

    var setFieldStatus = function ($field) {
        if (isIgnored($field)) return;
        var setDirtyStatus = function ($field) {
            if (isFieldDirty($field)) {
                setDirty($field);
            } else {
                setClean($field);
            }
        };

        // Option groups are a special case because they change more than the current element.
        if ($field.is(':radio[name]')) {
            var name = $field.attr('name'),
                $form = $field.parents('form');

            $form.find(":radio[name='" + name + "']").each(function () {
                setDirtyStatus($(this));
            });
        } else {
            setDirtyStatus($field);
        }
    };

    // Marks the element(s) (and their parent form) dirty
    var setDirty = function ($element) {
        dirtylog('setDirty called');
        var dirtyClass = $.DirtyForms.dirtyClass;

        $element.each(function () {
            var $form = $(this).closest('form');
            var changed = !$form.hasClass(dirtyClass);
            $(this).addClass(dirtyClass);
            if (changed) {
                $form.addClass(dirtyClass)
                     .trigger('dirty.dirtyforms', [$form]);
            }
        });
    };

    // Marks the element(s), their parent form, and any helpers within the element not dirty
    var setClean = function ($element) {
        dirtylog('setClean called');
        var dirtyForms = $.DirtyForms;
        var dirtyClass = dirtyForms.dirtyClass;

        $element.each(function () {
            var node = this, $node = $(this);

            // Clean helpers
            $.each(dirtyForms.helpers, function (key, obj) {
                if ("setClean" in obj) {
                    obj.setClean(node);
                }
            });

            // remove the current dirty class
            $node.removeClass(dirtyClass);

            if ($node.is('form')) {
                // remove all dirty classes from children
                $node.find(':dirty').removeClass(dirtyClass);
                $node.trigger('clean.dirtyforms', [$node]);
            } else {
                // if this is last dirty child, set form clean
                var $form = $node.parents('form');
                if ($form.find(':dirty').length === 0 && $form.hasClass(dirtyClass)) {
                    $form.removeClass(dirtyClass)
                         .trigger('clean.dirtyforms', [$form]);
                }
            }
        });
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
        delay(function () {
            setFieldStatus($field);
        }, 100);
    };

    var onReset = function () {
        var $fields = $(this).parents('form').find($.DirtyForms.fieldSelector);
        $fields.each(function () {
            setFieldStatus($(this));
        });
    };

    var bindExit = function () {
        var inIframe = (top !== self);

        $(document).on('click', 'a[href]', aBindFn)
                   .on('submit', 'form', bindFn);
        $(window).bind('beforeunload', beforeunloadBindFn);
        if ($.DirtyForms.watchTopDocument && inIframe) {
            $(top.document).on('click', 'a[href]', aBindFn)
                           .on('submit', 'form', bindFn);
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

    var isIgnored = function ($element) {
        return $element.closest('.' + $.DirtyForms.ignoreClass).length > 0 ||
            $element.is(getIgnoreSelector());
    };

    var getIgnoreSelector = function () {
        var result = $.DirtyForms.ignoreSelector;
        $.each($.DirtyForms.helpers, function (key, obj) {
            if ("ignoreAnchorSelector" in obj) {
                if (result.length > 0) { result += ','; }
                result += obj.ignoreAnchorSelector;
            }
        });
        return result;
    };

    var aBindFn = function (ev) {
        var $a = $(this),
            isDifferentTarget = /^_blank$/i.test($a.attr('target')),
            isFragment = /^#/.test($a.attr('href'));

        dirtylog('Anchor isIgnored: ' + isIgnored($a) + ', isDifferentTarget: ' + isDifferentTarget + ', isFragment: ' + isFragment);
        if (!isIgnored($a) && !isDifferentTarget && !isFragment) {
            bindFn(ev);
        }
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

        if (isIgnored($element)) {
            dirtylog('Leaving: Element has ignore class or a descendant of an ignored element');
            clearUnload();
            return false;
        }

        if (state.deciding) {
            dirtylog('Leaving: Already in the deciding process');
            return false;
        }

        if (!dirtyForms.isDirty()) {
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
