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
            var fieldSelector = $.DirtyForms.fieldSelector,
                data = {};

            if (!state.initialized) {
                // Override any default options
                $.extend(true, $.DirtyForms, options);

                $(document).trigger('bind.dirtyforms', [events]);
                events.bind(window, document, data);

                state.initialized = true;
            }

            elementsInRange(this, 'form', true).each(function () {
                var $form = $(this);
                dirtylog('Adding form ' + $form.attr('id') + ' to forms to watch');

                // Store original values of the fields
                $form.find(fieldSelector).each(function () {
                    storeOriginalValue($(this));
                });

                $form.trigger('scan.dirtyforms')
                     .addClass($.DirtyForms.listeningClass)
                     .on('change input propertychange keyup', fieldSelector, data, events.onFieldChange)
                     .on('focus keydown', fieldSelector, data, events.onFocus)
                     .on('reset', 'form', data, events.onReset);
            });
            return this;
        },
        // Returns true if any of the selected elements or their children are dirty
        isDirty: function (excludeHelpers) {
            var nonFormSelector = ':dirty:not(form)';
            if (this.filter(nonFormSelector).length > 0 || this.find(nonFormSelector).length > 0) return true;

            var isDirty = false;
            if (!excludeHelpers) {
                this.not(':dirtyignored').each(function (index) {
                    var $node = $(this);

                    $.each($.DirtyForms.helpers, function (i, helper) {
                        if (helper.isDirty && helper.isDirty($node, index)) {
                            isDirty = true;
                            return false;
                        }
                    });
                });

            }
            return isDirty;
        },
        // Marks the element(s) and any helpers within the element not dirty.
        // If all of the fields in a form are marked not dirty, the form itself will be marked not dirty even
        // if it is not included in the selector. Also resets original values to the current state - 
        // essentially "forgetting" the node or its descendants are dirty.
        setClean: function (excludeIgnored, excludeHelpers) {
            dirtylog('setClean called');

            var doSetClean = function () {
                var $field = $(this);

                // Reset by storing the original value again
                storeOriginalValue($field);

                // Remove the dirty class
                setDirtyStatus($field, false);
            };

            elementsInRange(this, $.DirtyForms.fieldSelector, excludeIgnored)
                .each(doSetClean)
                .parents('form').trigger('setclean.dirtyforms', [excludeIgnored]);

            if (excludeHelpers) return this;
            return fireHelperMethod(this, 'setClean', excludeIgnored);
        },
        // Scans the selected elements and descendants for any new fields and stores their original values.
        // Ignores any original values that had been set previously. Also resets the dirty status of all fields
        // whose ignore status has changed since the last scan.
        rescan: function (excludeIgnored, excludeHelpers) {
            dirtylog('rescan called');

            var doRescan = function () {
                var $field = $(this);

                // Skip previously added fields
                if (!hasOriginalValue($field)) {
                    // Store the original value
                    storeOriginalValue($field);
                }

                // Set the dirty status
                setDirtyStatus($field, isFieldDirty($field));
            };

            elementsInRange(this, $.DirtyForms.fieldSelector, excludeIgnored)
                .each(doRescan)
                .parents('form').trigger('rescan.dirtyforms', [excludeIgnored]);

            if (excludeHelpers) return this;
            return fireHelperMethod(this, 'rescan', excludeIgnored);
        }
    };

    // Custom selectors $('form:dirty')
    $.extend($.expr[":"], {
        dirty: function (a) {
            return $(a).not(':dirtyignored').hasClass($.DirtyForms.dirtyClass);
        },
        dirtylistening: function (a) {
            return $(a).hasClass($.DirtyForms.listeningClass);
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
        message: "You've made changes on this page which aren't saved. If you leave you will lose these changes.",
        title: 'Are you sure you want to do that?',
        dirtyClass: 'dirty',
        listeningClass: 'dirtylisten',
        ignoreClass: 'dirtyignore',
        ignoreSelector: '',
        // exclude all HTML 4 except checkbox, option, text and password, but include HTML 5 except search
        fieldSelector: "input:not([type='button'],[type='image'],[type='submit']," +
            "[type='reset'],[type='file'],[type='search']),select,textarea",
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
            events.clearUnload(); // fix for chrome/safari
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
            this.deciding = this.decidingEvent = this.dialogStash = $.DirtyForms.choiceContinue = false;
        }
    };

    // Event management
    var events = {
        bind: function (window, document, data) {
            $(window).bind('beforeunload', data, this.onBeforeUnload);
            $(document).on('click', 'a[href]:not([target="_blank"])', data, this.onAnchorClick)
                       .on('submit', 'form', data, this.onSubmit);
        },
        // For any fields added after the form was initialized, store the value when focused.
        onFocus: function () {
            var $field = $(this);
            if (!hasOriginalValue($field)) {
                storeOriginalValue($field);
            }
        },
        onFieldChange: function (ev) {
            var $field = $(this);
            if (ev.type !== 'change') {
                delay(function () { setFieldStatus($field); }, 100);
            } else {
                setFieldStatus($field);
            }
        },
        onReset: function () {
            var $form = $(this).closest('form');
            // Need a delay here because reset is called before the state of the form is reset.
            setTimeout(function () { $form.dirtyForms('setClean'); }, 100);
        },
        onAnchorClick: function (ev) {
            bindFn(ev);
        },
        onSubmit: function (ev) {
            bindFn(ev);
        },
        onBeforeUnload: function (ev) {
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
        },
        onRefireClick: function (ev) {
            var event = new $.Event('click');
            $(ev.target).trigger(event);
            if (!event.isDefaultPrevented()) {
                this.onRefireAnchorClick(ev);
            }
        },
        onRefireAnchorClick: function (ev) {
            var href = $(ev.target).closest('[href]').attr('href');
            dirtylog('Sending location to ' + href);
            window.location.href = href;
        },
        clearUnload: function () {
            // I'd like to just be able to unbind this but there seems
            // to be a bug in jQuery which doesn't unbind onbeforeunload
            dirtylog('Clearing the beforeunload event');
            $(window).unbind('beforeunload', this.onBeforeUnload);
            window.onbeforeunload = null;
            $(document).trigger('beforeunload.dirtyforms');
        }
    };

    var elementsInRange = function ($this, selector, excludeIgnored) {
        var $elements = $this.filter(selector).add($this.find(selector));
        if (excludeIgnored) {
            $elements = $elements.not(':dirtyignored');
        }
        return $elements;
    };

    var fireHelperMethod = function ($this, method, excludeIgnored) {
        return $this.each(function (index) {
            var $node = $(this);

            if (!excludeIgnored || !$node.is(':dirtyignored')) {
                $.each($.DirtyForms.helpers, function (i, helper) {
                    if (helper[method]) { helper[method]($node, index, excludeIgnored); }
                });
            }
        });
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

            if (isDirty) $form.trigger('dirty.dirtyforms');
            if (!isDirty) $form.trigger('clean.dirtyforms');
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

    var bindFn = function (ev) {
        var $element = $(ev.target),
            eventType = ev.type,
            dirtyForms = $.DirtyForms;
        dirtylog('Entering: Leaving Event fired, type: ' + eventType + ', element: ' + ev.target + ', class: ' + $element.attr('class') + ' and id: ' + ev.target.id);

        // Important: Do this check before calling events.clearUnload()
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
            events.clearUnload();
            return false;
        }

        if (state.deciding) {
            dirtylog('Leaving: Already in the deciding process');
            return false;
        }

        if (!$('form:dirtylistening').dirtyForms('isDirty')) {
            dirtylog('Leaving: Not dirty');
            events.clearUnload();
            return false;
        }

        if (eventType == 'submit' && $element.dirtyForms('isDirty')) {
            dirtylog('Leaving: Form submitted is a dirty form');
            events.clearUnload();
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

    var refire = function (ev) {
        $(document).trigger('beforeRefire.dirtyforms');
        if (ev.type === 'click') {
            dirtylog("Refiring click event");
            events.onRefireClick(ev);
        } else {
            dirtylog("Refiring " + ev.type + " event on " + ev.target);
            var target;
            if ($.DirtyForms.formStash) {
                dirtylog('Appending stashed form to body');
                target = $.DirtyForms.formStash;
                $('body').append(target);
            }
            else {
                target = $(ev.target).closest('form');
            }
            target.trigger(ev.type);
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
