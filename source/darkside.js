(function(DarkSide) {

	'use strict';

	extend(DarkSide.prototype, {

		defaults: {
			end: null,
			path: null,
			domain: null,
			secure: null,
		},

		cache: {
			cookie: "",
			keys: [],
			values: [],
			pairs: {}
		},

		write: function (key, value, options) {

			var expires = "",
				config = this.defaults;

			if (options) extend(config, options);

			if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return;
			
			if (config.end) {
				switch (end.constructor) {
					case Number:
						expires = config.end === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + config.end;
							break;
					case String:
						expires = "; expires=" + config.end;
							break;
					case Date:
						expires = "; expires=" + config.end.toGMTString();
							break;
				};
			};
			
			if (typeof value !== 'string') value = stringify(value);
			
			set(
				escape(key) + "="  + escape(value) + expires 
				+ (config.domain ? "; domain=" + config.domain : "") 
				+ (config.path ? "; path=" + config.path : "") 
				+ (config.secure ? "; secure" : "")
			);
			
			this.refresh();
		},
		
		read: function(key) {
		
			if (!key || !this.exists(key)) return null;
			
			this.refreshIf();
			return this.cache.pairs[key];
		},
		
		remove: function(key, path, skip) {

			if (!key || !this.exists(key)) return;
			
			set(
				escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" 
				+ (path ? "; path=" + path : "")
			);
			
			if (!skip) this.refresh();
		},
		
		removeAll: function(path) {
		
			var keys = this.keys(),
				len = keys.length,
				i = 0;
				
			for (; i < len; i++) this.remove.apply(this, [keys[i], path], true);
			
			this.refresh();
		},
		
		equal: function(key, value) {
			if (!key || !this.exists(key)) return;
			return this.read(key) === value;
		},
		
		exists: function(key) {
			return this.cache.pairs[key];
		},
		
		valueExists: function(value) {
			if (typeof value !== 'string') value = stringify(value);
			return this.cache.values[value];
		},
		
		pairExists: function(key, value) {
			if (typeof value !== 'string') value = stringify(value);
			return this.cache.pairs[key] && (this.cache.pairs[key] === value);
		},
		
		keys: function() {
		
			this.refreshIf();
			return this.cache.keys;
		},
		
		values: function() {
		
			this.refreshIf();
			return this.cache.values;
		},
		
		pairs: function() {
		
			this.refreshIf();
			return this.cache.pairs;
		},
		
		refresh: function() {

			var freshCookie = get();
			
			if (freshCookie) {
			
				var pairs = {}, keys = [], values = [],
					pair, key, value, rawValue,
					
					arr = freshCookie.split(';'), 
					len = arr.length,
					i = 0;
				
				for (; i < len; i++) {
				
					pair = arr[i].split( '=' );
					key = pair[0].replace( /^\s*/, '' ).replace( /\s*$/, '' );

					try {
						value = decodeURIComponent( pair[1] );
					} catch(e1) {
						value = pair[1];
					};
					
					if (window.JSON && JSON.parse) {
						try {
							rawValue = value;
							value = JSON.parse( value );
						} catch(e2) {
							value = rawValue;
						};
					};

					keys.push(key);
					values.push(value);
					pairs[key] = value;
				};
				
				this.cache.cookie = freshCookie;
				this.cache.keys = keys;
				this.cache.values = values;
				this.cache.pairs = pairs;
			
			} else {
			
				this.cache.cookie = '';
				this.cache.keys = [];
				this.cache.values = [];
				this.cache.pairs = {};
				
			};
		},
		
		refreshIf: function() {
			if (this.cache.cookie !== document.cookie) this.refresh();
		}
	});
	
	/*
		Private helpers
	*/
	function stringify(value) {
		if (window.JSON && JSON.stringify) value = JSON.stringify( value );
		else throw new Error('darkside: could not serialize value');
		return value;
	};
	
	function extend(sub, sup) {
		for (var prop in sup) sub[prop] = sup[prop];
	};
	
	function set(str) {
		document.cookie = str;
	};
	
	function get() {
		return document.cookie;
	};
	
	window.darkside = new DarkSide();

})(function DarkSide(){
	this.refresh();
});