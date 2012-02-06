/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of:
  Hogan.JS by Twitter, Inc.
  https://github.com/twitter/hogan.js
  Licensed under the Apache License, Version 2.0
  http://www.apache.org/licenses/LICENSE-2.0
==================================================================================================
*/

(function (useArrayBuffer) 
{
	var rAmp = /&/g,
			rLt = /</g,
			rGt = />/g,
			rApos =/\'/g,
			rQuot = /\"/g,
			hChars =/[&<>\"\']/;


	function coerceToString(val) {
		return String((val === null || val === undefined) ? '' : val);
	}

	function hoganEscape(str) {
		str = coerceToString(str);
		return hChars.test(str) ?
			str
				.replace(rAmp,'&amp;')
				.replace(rLt,'&lt;')
				.replace(rGt,'&gt;')
				.replace(rApos,'&#39;')
				.replace(rQuot, '&quot;') :
			str;
	}

	var isArray = Array.isArray || function(a) {
		return Object.prototype.toString.call(a) === '[object Array]';
	};
	
	core.Class("core.template.Template",
	{
		construct: function (renderFunc, text, compiler, options) {
			this.r = renderFunc || this.r;
			this.c = compiler;
			this.options = options;
			this.text = text || '';
			this.buf = (useArrayBuffer) ? [] : '';
		},
		
		members: {
			
			// render: replaced by generated code.
			r: function (context, partials, indent) { return ''; },

			// variable escaping
			v: hoganEscape,

			// triple stache
			t: coerceToString,

			render: function render(context, partials, indent) {
				return this.ri([context], partials || {}, indent);
			},

			// render internal -- a hook for overrides that catches partials too
			ri: function (context, partials, indent) {
				return this.r(context, partials, indent);
			},

			// tries to find a partial in the curent scope and render it
			rp: function(name, context, partials, indent) {
				var partial = partials[name];

				if (!partial) {
					return '';
				}

				if (this.c && typeof partial == 'string') {
					partial = this.c.compile(partial, this.options);
				}

				return partial.ri(context, partials, indent);
			},

			// render a section
			rs: function(context, partials, section) {
				var tail = context[context.length - 1];

				if (!isArray(tail)) {
					section(context, partials, this);
					return;
				}

				for (var i = 0; i < tail.length; i++) {
					context.push(tail[i]);
					section(context, partials, this);
					context.pop();
				}
			},

			// maybe start a section
			s: function(val, ctx, partials, inverted, start, end, tags) {
				var pass;

				if (isArray(val) && val.length === 0) {
					return false;
				}

				if (typeof val == 'function') {
					val = this.ls(val, ctx, partials, inverted, start, end, tags);
				}

				pass = (val === '') || !!val;

				if (!inverted && pass && ctx) {
					ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
				}

				return pass;
			},

			// find values with dotted names
			d: function(key, ctx, partials, returnFound) {
				var names = key.split('.'),
						val = this.f(names[0], ctx, partials, returnFound),
						cx = null;

				if (key === '.' && isArray(ctx[ctx.length - 2])) {
					return ctx[ctx.length - 1];
				}

				for (var i = 1; i < names.length; i++) {
					if (val && typeof val == 'object' && names[i] in val) {
						cx = val;
						val = val[names[i]];
					} else {
						val = '';
					}
				}

				if (returnFound && !val) {
					return false;
				}

				if (!returnFound && typeof val == 'function') {
					ctx.push(cx);
					val = this.lv(val, ctx, partials);
					ctx.pop();
				}

				return val;
			},

			// find values with normal names
			f: function(key, ctx, partials, returnFound) {
				var val = false,
						v = null,
						found = false;

				for (var i = ctx.length - 1; i >= 0; i--) {
					v = ctx[i];
					if (v && typeof v == 'object' && key in v) {
						val = v[key];
						found = true;
						break;
					}
				}

				if (!found) {
					return (returnFound) ? false : "";
				}

				if (!returnFound && typeof val == 'function') {
					val = this.lv(val, ctx, partials);
				}

				return val;
			},

			// higher order templates
			ho: function(val, cx, partials, text, tags) {
				var compiler = this.c;
				var options = this.options;
				options.delimiters = tags;
				var t = val.call(cx, text, function(t) {
					return compiler.compile(t, options).render(cx, partials);
				});
				this.b(compiler.compile(t.toString(), options).render(cx, partials));
				return false;
			},

			// template result buffering
			b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
														function(s) { this.buf += s; },
			fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
														 function() { var r = this.buf; this.buf = ''; return r; },

			// lambda replace section
			ls: function(val, ctx, partials, inverted, start, end, tags) {
				var cx = ctx[ctx.length - 1],
						t = null;

				if (!inverted && this.c && val.length > 0) {
					return this.ho(val, cx, partials, this.text.substring(start, end), tags);
				}

				t = val.call(cx);

				if (typeof t == 'function') {
					if (inverted) {
						return true;
					} else if (this.c) {
						return this.ho(t, cx, partials, this.text.substring(start, end), tags);
					}
				}

				return t;
			},

			// lambda replace variable
			lv: function(val, ctx, partials) {
				var cx = ctx[ctx.length - 1];
				var result = val.call(cx);
				if (typeof result == 'function') {
					result = result.call(cx);
				}
				result = coerceToString(result);

				if (this.c && ~result.indexOf("{\u007B")) {
					return this.c.compile(result, this.options).render(cx, partials);
				}

				return result;
			}
		}
	});
	
})();