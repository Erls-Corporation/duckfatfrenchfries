// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

// Place any jQuery/helper plugins in here.

/*
 * bootstrap-filestyle.js v1.0
 * http://markusslima.github.com/Filestyle-bootstrap/
 *
 * Copyright 2012
 *
 * Licensed under the MIT License
 */

(function ($) {
    // Register plugin
    $.fn.filestyle = function (options) {
		if (typeof options == 'object' || typeof options == 'undefined'){
			var defaults = {
				buttonText : 'Choose file',
				textField : true,
				icon : false,
				classButton : '',
				classText : '',
				classIcon : 'icon-folder-open'
			}

			var options = $.extend(defaults, options);

			return this.each(function () {
				var $this = $(this)

				$this.data('filestyle', true);

				$this
					.css({'position':'fixed','top':'-100px','left':'-100px'})
					.parent()
					.addClass("form-search")
					.append(
						(options.textField ? '<input type="text" class="'+options.classText+'" disabled size="40" /> ' : '')+
						'<button type="button" class="btn '+options.classButton+'" >'+
							(options.icon ? '<i class="'+options.classIcon+'"></i> ' : '')+
							options.buttonText+
						'</button>');

				$this.change(function () {
					$this.parent().children(':text').val($(this).val());
				});

				
				// Add event click
				$this.parent().children(':button').click(function () {
					$this.click();
				});
			});
		} else {
			return this.each(function () {
				var $this = $(this)
				if ($this.data('filestyle') == true && options == 'clear') {
					$this.parent().children(':text').val('');
					$this.val('');
				} else {
					console.error('Method filestyle not defined!');
				}
			});
		}
    }
})(jQuery);