/*
---
name: Host
description: The Host object
...
*/

define('Core/Host', function(){

	var slice = Array.prototype.slice;

	// Host class

	return function Host(native_){
	
		var prototypes = {}, generics = {}, host = function(){
			return native_.apply(native_, arguments);
		};
	
		host.install = function(object){
			object = object || native_;
			for (key in generics) if (!object[key]) native_[key] = generics[key];
			for (key in prototypes) if (!object.prototype[key]) object.prototype[key] = prototypes[key];
			return this;
		};
	
		host.implement = function(key, fn){
			if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else if (!this.prototype[key] && fn){
				var proto = (native_.prototype[key]) ? native_.prototype[key] : null;
				if (!proto) proto = prototypes[key] = fn;
				this.prototype[key] = proto;
				this.extend(key, function(){
					var args = slice.call(arguments);
					return proto.apply(args.shift(0), args);
				});
			}
			return this;
		};
	
		host.extend = function(key, fn){
			if (typeof key != 'string') for (var k in key) this.extend(k, key[k]); else if (!this[key] && fn){
				var generic = (native_[key]) ? native_[key] : null;
				if (!generic) generic = generics[key] = fn;
				this[key] = generic;
			}
			return this;
		};
	
		return host;
	
	};

});
