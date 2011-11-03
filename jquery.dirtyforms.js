// Copyright 2010 Mal Curtis

if (typeof jQuery == 'undefined') throw("jQuery Required");

(function($){
	// Public General Plugin methods $.DirtyForms
	$.extend({
		DirtyForms: {
			debug : false,
			message : 'You\'ve made changes on this page which aren\'t saved. If you leave you will lose these changes.',
			title : 'Are you sure you want to do that?',
			dirtyClass : 'dirty',
			listeningClass : 'dirtylisten',
			ignoreClass : 'ignoredirty',
			helpers : [],
			dialog : {
				refire : function(content, ev){
					$.facebox(content);
				},
				fire : function(message, title){
					var content = '<h1>' + title + '</h1><p>' + message + '</p><p><a href="#" class="ignoredirty button medium red continue">Continue</a><a href="#" class="ignoredirty button medium cancel">Stop</a>';
					$.facebox(content);
				},
				bind : function(){
					$('#facebox .cancel, #facebox .close, #facebox_overlay').click(decidingCancel);
					$('#facebox .continue').click(decidingContinue);
					$(document).bind('decidingcancelled.dirtyforms', function(){
					 	// Hacky way of manually removing the fuck out of Facebox
						$("#facebox").remove();
					 	$('#facebox_overlay').remove();
					 	$.facebox.settings.inited = false;
					});
				},
				stash : function(){
					var fb = $('#facebox');
					return ($.trim(fb.html()) == '' || fb.css('display') != 'block') ?
					   false :
					   $('#facebox .content').clone(true);
				},
				selector : '#facebox .content'
			},

			isDirty : function(){
				dirtylog('Core isDirty is starting ');
				var isDirty = false;
				$(':dirtylistening').each(function(){
					if($(this).isDirty()){
						isDirty = true;
						return true;
					}
				});

				$.each($.DirtyForms.helpers, function(key,obj){
					if("isDirty" in obj){
						if(obj.isDirty()){
							isDirty = true;
							return true;
						}
					}
				});

				dirtylog('Core isDirty is returning ' + isDirty);
				return isDirty;
			}


		}
	});

	// Create a custom selector $('form:dirty')
	$.extend($.expr[":"], {
		dirtylistening : function(a){
			return $(a).hasClass($.DirtyForms.listeningClass);
		},
		dirty : function(a){
			return $(a).hasClass($.DirtyForms.dirtyClass);
		}
	});

	// Public Element methods $('form').dirtyForm();
	$.fn.dirtyForms = function(){
		var core = $.DirtyForms;
		var thisForm = this;

		dirtylog('Adding forms to watch');
		bindExit();

		return this.each(function(e){
			dirtylog('Adding form ' + $(this).attr('id') + ' to forms to watch');
			$(this).addClass(core.listeningClass);
			$('input:text, input:password, input:checkbox, input:radio, textarea, select', this).change(function(){
				$(this).setDirty();
			});
		});
	}

	$.fn.setDirty = function(){
		dirtylog('setDirty called');
		return this.each(function(e){
			$(this).addClass($.DirtyForms.dirtyClass).parents('form').addClass($.DirtyForms.dirtyClass);
		});
	}

	// Returns true if any of the supplied elements are dirty
	$.fn.isDirty = function(){
		var isDirty = false;
		var node = this;
		this.each(function(e){
			if($(this).hasClass($.DirtyForms.dirtyClass)){
				isDirty = true;
				return true;
			}
		});
		$.each($.DirtyForms.helpers, function(key,obj){
			if("isNodeDirty" in obj){
				if(obj.isNodeDirty(node)){
					isDirty = true;
					return true;
				}
			}
		});

		dirtylog('isDirty returned ' + isDirty);
		return isDirty;
	}

	// Private Properties and Methods
	var settings = $.extend({
		exitBound : false,
		formStash : false,
		dialogStash : false,
		deciding : false,
		decidingEvent : false,
		currentForm : false,
		hasFirebug : "console" in window && "firebug" in window.console,
		hasConsoleLog: "console" in window && "log" in window.console
	}, $.DirtyForms);

	dirtylog = function(msg){
		if(!$.DirtyForms.debug) return;
		msg = "[DirtyForms] " + msg;
		settings.hasFirebug ?
			console.log(msg) :
			settings.hasConsoleLog ?
				window.console.log(msg) :
				alert(msg);
	}
	bindExit = function(){
		if(settings.exitBound) return;
		$('a').live('click',aBindFn);
		$('form').live('submit',formBindFn);
		$(window).bind('beforeunload', beforeunloadBindFn);
		settings.exitBound = true;
	}

	aBindFn = function(ev){
		 bindFn(ev);
	}

	formBindFn = function(ev){
		settings.currentForm = this;
		bindFn(ev);
	}

	beforeunloadBindFn = function(ev){
		var result = bindFn(ev);

		if(result && settings.doubleunloadfix != true){
			dirtylog('Before unload will be called, resetting');
			settings.deciding = false;
		}

		settings.doubleunloadfix = true;
		setTimeout(function(){settings.doubleunloadfix = false;},200);

		if(result === false) return null;
		return result;
	}

	bindFn = function(ev){
		dirtylog('Entering: Leaving Event fired, type: ' + ev.type + ', element: ' + ev.target + ', class: ' + $(ev.target).attr('class') + ' and id: ' + ev.target.id);

		if(ev.type == 'beforeunload' && settings.doubleunloadfix){
			dirtylog('Skip this unload, Firefox bug triggers the unload event multiple times');
			settings.doubleunloadfix = false;
			return false;
		}

		if($(ev.target).hasClass(settings.ignoreClass)){
			dirtylog('Leaving: Element has ignore class');
			if(!ev.isDefaultPrevented()){
				clearUnload();
			}
			return false;
		}

		if(settings.deciding){
			dirtylog('Leaving: Already in the deciding process');
			return false;
		}

		if(ev.isDefaultPrevented()){
			dirtylog('Leaving: Event has been stopped elsewhere');
			return false;
		}

		if(!settings.isDirty()){
			dirtylog('Leaving: Not dirty');
			if(!ev.isDefaultPrevented()){
				clearUnload();
			}
			return false;
		}

		if(ev.type == 'submit' && $(ev.target).isDirty()){
			dirtylog('Leaving: Form submitted is a dirty form');
			if(!ev.isDefaultPrevented()){
				clearUnload();
			}
			return true;
		}

		settings.deciding = true;
		settings.decidingEvent = ev;
		dirtylog('Setting deciding active');

		if(settings.dialog !== false)
		{
			dirtylog('Saving dialog content');
			settings.dialogStash =settings.dialog.stash();
			dirtylog(settings.dialogStash);
		}

		// Callback for page access in current state
		$(document).trigger('defer.dirtyforms');

		if(ev.type == 'beforeunload'){
			//clearUnload();
			dirtylog('Returning to beforeunload browser handler with: ' + settings.message);
			return settings.message;
		}
		if(!settings.dialog) return;

		ev.preventDefault();
		ev.stopImmediatePropagation();

		if($(ev.target).is('form') && $(ev.target).parents(settings.dialog.selector).length > 0){
			dirtylog('Stashing form');
			settings.formStash = $(ev.target).clone(true).hide();
		}else{
			settings.formStash = false;
		}

		dirtylog('Deferring to the dialog');
		settings.dialog.fire($.DirtyForms.message, $.DirtyForms.title);
		settings.dialog.bind();
	}

	decidingCancel = function(ev){
		ev.preventDefault();
		$(document).trigger('decidingcancelled.dirtyforms');
		if(settings.dialog !== false && settings.dialogStash !== false)
		{
			dirtylog('Refiring the dialog with stashed content');
			settings.dialog.refire(settings.dialogStash.html(), ev);
		}
		$(document).trigger('decidingcancelledAfter.dirtyforms');
		settings.dialogStash = false;
		settings.deciding = settings.currentForm = settings.decidingEvent = false;
	}

	decidingContinue = function(ev){
		ev.preventDefault();
		settings.dialogStash = false;
		$(document).trigger('decidingcontinued.dirtyforms');
		refire(settings.decidingEvent);
	}

	clearUnload = function(){
		// I'd like to just be able to unbind this but there seems
		// to be a bug in jQuery which doesn't unbind onbeforeunload
		dirtylog('Clearing the beforeunload event');
		$(window).unbind('beforeunload', beforeunloadBindFn);
		window.onbeforeunload = null;
	}

	refire = function(e){
		$(document).trigger('beforeRefire.dirtyforms');
		switch(e.type){
			case 'click':
				dirtylog("Refiring click event");
				var event = new jQuery.Event('click');
				$(e.target).trigger(event);
				if(!event.isDefaultPrevented()){
					var anchor = $(e.target).closest('[href]');
					dirtylog('Sending location to ' + anchor.attr('href'));
					location.href = anchor.attr('href');
					return;
				}
				break;
			default:
				dirtylog("Refiring " + e.type + " event on " + e.target);
				var target;
				if(settings.formStash){
					dirtylog('Appending stashed form to body');
					target = settings.formStash;
					$('body').append(target);
				}
				else{
					target = $(e.target);
					if(!target.is('form'))
						target = target.closest('form');
				}
				target.trigger(e.type);
				break;
		}
	}

})(jQuery);
