(function(DarkSide) {
 
	extend(DarkSide.prototype, {
	
		defaults: {
			end: null,
			path: null,
			domain: null,
			secure: null,
		},
		
		init: function(me) {
			this.interval = setInterval(function() {
				if (me.cache.cookie !== document.cookie) me.refresh();
			}, 250);
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
			
			if (typeof value !== 'string') {
				if (window.JSON && JSON.stringify) value = JSON.stringify( value );
				else throw new Error('darkside.write could not serialize value.');
			};
			
			this.set(
				escape(key) + "="  + escape(value) + expires 
				+ (config.domain ? "; domain=" + config.domain : "") 
				+ (config.path ? "; path=" + config.path : "") 
				+ (config.secure ? "; secure" : "")
			);
			
			this.refresh();
		},
		
		read: function(key) {
		
			if (!key || !this.exists(key)) return null;
			return this.cache.pairs[key];
		},
		
		remove: function(key, path) {
		
			if (!key || !this.exists(key)) return;
			
			this.set(
				escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" 
				+ (path ? "; path=" + path : "")
			);
			
			this.refresh();
		},
		
		removeAll: function(path) {
		
			var keys = this.keys(),
				len = keys.length,
				i = 0;
				
			for (; i < len; i++) this.remove.apply(this, [keys[i], path]);
			
			this.refresh();
		},
		
		equal: function(key, value) {
			if (!key || !this.exists(key)) return;
			return this.read(key) === value;
		},
		
		exists: function(key) {
		
			return inArray(this.cache.keys, key);
		},
		
		keys: function() {
		
			if (!this.cache.keys.length) this.refresh();
			return this.cache.keys;
		},
		
		values: function() {
		
			if (!this.cache.values.length) this.refresh();
			return this.cache.values;
		},
		
		pairs: function() {
		
			if (!this.cache.pairs.length) this.refresh();
			return this.cache.pairs;
		},
	
		cache: {
			cookie: document.cookie,
			keys: [],
			values: [],
			pairs: {}
		},
		
		refresh: function() {

			var pairs = {}, keys = [], values = [],
				pair, key, value, rawValue,
				
				arr = this.get().split(';'), 
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
					}
				}

				keys.push(key);
				values.push(value);
				pairs[key] = value;
			};
			
			this.cache.keys = keys;
			this.cache.values = values;
			this.cache.pairs = pairs;
		},
		
		set: function(str) {
			document.cookie = str;
		},
		
		get: function() {
			return document.cookie;
		},
		
		// :p
		toString: function() {
			return "Come to the dark side we've got cookies...";
		}
	});
	
	/*
		Private helpers
	*/
	function extend(sub, sup) {
		for (var prop in sup) sub[prop] = sup[prop];
	};
	
	function inArray(array, key) {
	
		var len = array.length, 
			i = 0;
			
		for (; i < len; i++) {
			if (array[i] ===  key) return true;
		};
		
		return false;
	};
	
	window.darkside = new DarkSide();

})(function DarkSide(){
	this.refresh();
	this.init(this);
});