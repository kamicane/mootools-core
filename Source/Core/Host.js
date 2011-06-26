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
		return (this instanceof host) ? this : native_.apply(native_, arguments);
	};

	host.install = function(object){
		object = object || native_;
		for (key in prototypes) if (!object.prototype[key]) object.prototype[key] = prototypes[key];
		return this;
	};

	var implement = host.implement = function(key, fn){
		if (typeof key != 'string') for (var k in key) implement.call(this, k, key[k]); else if (!this.prototype[key] && fn){
			var proto = this.prototype[key] = prototypes[key] = (native_.prototype[key] || fn);
			extend.call(this, key, function(){
				var args = slice.call(arguments);
				return proto.apply(args.shift(0), args);
			});
		}
		return this;
	};

	var extend = host.extend = function(key, fn){
		if (typeof key != 'string') for (var k in key) extend.call(this, k, key[k]);
		else if (!this[key] && fn) generics[key] = this[key] = (native_[key] || fn);
		return this;
	};

	return host;

};

});
